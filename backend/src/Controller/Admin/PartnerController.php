<?php

namespace App\Controller\Admin;

use App\Entity\Partners;
use App\Repository\PartnersRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/admin')]
class PartnerController extends AbstractController
{
    private string $uploadDir;
    public function __construct(
        private EntityManagerInterface $entityManager,
        private PartnersRepository $partnersRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/partners/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
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
        return '/uploads/partners/' . $newFilename;
    }

    #[Route('/partners', name: 'admin_partners_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $partners = $this->partnersRepository->findAll();
        $data = array_map(function ($partner) {
            return [
                'id' => $partner->getId(),
                'name' => $partner->getName(),
                'image' => $partner->getImage(),
                'site_url' => $partner->getSiteUrl(),
                'published' => $partner->isPublished(),
            ];
        }, $partners);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'partner:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }


    #[Route('/partners/new', name: 'admin_partners_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $partner = new Partners();
        $partner->setName($data['name']);
        $partner->setSiteUrl($data['site_url']);
        $partner->setPublished($data['published'] ?? false);

        if (isset($data['image'])) {
            $imagePath = $this->handleImageUpload($data['image']);
            $partner->setImage($imagePath);
        }

        $this->entityManager->persist($partner);
        $this->entityManager->flush();

        $response = $this->serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        return new JsonResponse($response, Response::HTTP_CREATED, [], true);
    }

    #[Route('/partners/{id}', name: 'admin_partners_update', methods: ['PUT'])]
    public function update(Request $request, Partners $partner): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $partner->setName($data['name']);

        // Handle image upload if new image is provided
        if (isset($data['image']) && $data['image'] !== $partner->getImage()) {
            // Delete old image if exists
            $oldImagePath = $this->params->get('kernel.project_dir') . '/public' . $partner->getImage();
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
            $imagePath = $this->handleImageUpload($data['image']);
            $partner->setImage($imagePath);
        }

        $partner->setSiteUrl($data['site_url']);
        if (isset($data['published'])) {
            $partner->setPublished($data['published']);
        }

        $this->entityManager->flush();

        $response = $this->serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/partners/{id}', name: 'admin_partners_delete', methods: ['DELETE'])]
    public function delete(Partners $partner): JsonResponse
    {
        $this->entityManager->remove($partner);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/partners/{id}/toggle-publish', name: 'admin_partners_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(Partners $partner): JsonResponse
    {
        $partner->setPublished(!$partner->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($partner, 'json', ['groups' => 'partner:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
