<?php

namespace App\Controller\Admin;

use App\Entity\Sponsors;
use App\Repository\SponsorsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[Route('/api/admin')]
class SponsorController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private SponsorsRepository $sponsorsRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/sponsors/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    #[Route('/sponsors', name: 'admin_sponsors_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $sponsors = $this->sponsorsRepository->findAll();

        // Map entities to array
        $data = array_map(function ($sponsor) {
            return [
                'id' => $sponsor->getId(),
                'name' => $sponsor->getName(),
                'description' => $sponsor->getDescription(),
                'image' => $sponsor->getImage(),
                'site_url' => $sponsor->getSiteUrl(),
                'published' => $sponsor->isPublished(),
            ];
        }, $sponsors);
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'sponsor:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    private function handleImageUpload($imageData): ?string
    {
        if (!$imageData) {
            return null;
        }

        // Check if the image data is base64
        if (strpos($imageData, 'data:image') === 0) {
            // Extract the base64 data
            $imageData = explode(',', $imageData)[1];
        }

        // Decode base64 data
        $imageData = base64_decode($imageData);
        if ($imageData === false) {
            throw new \Exception('Invalid image data');
        }

        // Generate unique filename
        $originalFilename = uniqid() . '.png';
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.png';

        // Save the file
        $filePath = $this->uploadDir . $newFilename;
        file_put_contents($filePath, $imageData);

        // Return the relative path for storage in database
        return '/uploads/sponsors/' . $newFilename;
    }

    #[Route('/sponsors', name: 'admin_sponsors_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $sponsor = new Sponsors();
            $sponsor->setName($data['name']);
            $sponsor->setDescription($data['description']);

            // Handle image upload
            if (isset($data['image'])) {
                $imagePath = $this->handleImageUpload($data['image']);
                $sponsor->setImage($imagePath);
            }

            $sponsor->setSiteUrl($data['site_url']);
            $sponsor->setPublished($data['published'] ?? false);

            $this->entityManager->persist($sponsor);
            $this->entityManager->flush();

            $response = $this->serializer->serialize($sponsor, 'json', ['groups' => 'sponsor:read']);
            return new JsonResponse($response, Response::HTTP_CREATED, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/sponsors/{id}', name: 'admin_sponsors_update', methods: ['PUT'])]
    public function update(Request $request, Sponsors $sponsor): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $sponsor->setName($data['name']);
            $sponsor->setDescription($data['description']);

            // Handle image upload if new image is provided
            if (isset($data['image']) && $data['image'] !== $sponsor->getImage()) {
                // Delete old image if exists
                $oldImagePath = $this->getParameter('kernel.project_dir') . '/public' . $sponsor->getImage();
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }

                $imagePath = $this->handleImageUpload($data['image']);
                $sponsor->setImage($imagePath);
            }

            $sponsor->setSiteUrl($data['site_url']);
            if (isset($data['published'])) {
                $sponsor->setPublished($data['published']);
            }

            $this->entityManager->flush();

            $response = $this->serializer->serialize($sponsor, 'json', ['groups' => 'sponsor:read']);
            return new JsonResponse($response, Response::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/sponsors/{id}', name: 'admin_sponsors_delete', methods: ['DELETE'])]
    public function delete(Sponsors $sponsor): JsonResponse
    {
        try {
            // Delete the image file if it exists
            if ($sponsor->getImage()) {
                $imagePath = $this->getParameter('kernel.project_dir') . '/public' . $sponsor->getImage();
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $this->entityManager->remove($sponsor);
            $this->entityManager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/sponsors/{id}/toggle-publish', name: 'admin_sponsors_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(Sponsors $sponsor): JsonResponse
    {
        $sponsor->setPublished(!$sponsor->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($sponsor, 'json', ['groups' => 'sponsor:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
