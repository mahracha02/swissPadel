<?php

namespace App\Controller\Admin;

use App\Entity\ProfessionalService;
use App\Repository\ProfessionalServiceRepository;
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
class ProfessionalServiceController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private ProfessionalServiceRepository $professionalServiceRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/professional-services/';
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    #[Route('/professional-services', name: 'admin_professional_services_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $services = $this->professionalServiceRepository->findAll();

        //map entities to array
        $data = array_map(function ($service) {
            return [
                'id' => $service->getId(),
                'title' => $service->getTitle(),
                'description' => $service->getDescription(),
                'image' => $service->getImage(),
                'published' => $service->isPublished(),
            ];
        }, $services);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'professional_service:read']);
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
        return '/uploads/professional-services/' . $newFilename;
    }

    #[Route('/professional-services', name: 'admin_professional_services_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $service = new ProfessionalService();
            $service->setTitle($data['title']);
            $service->setDescription($data['description']);

            // Handle image upload
            if (isset($data['image'])) {
                $imagePath = $this->handleImageUpload($data['image']);
                $service->setImage($imagePath);
            }

            $service->setPublished($data['published'] ?? false);

            $this->entityManager->persist($service);
            $this->entityManager->flush();

            $response = $this->serializer->serialize($service, 'json', ['groups' => 'professional_service:read']);
            return new JsonResponse($response, Response::HTTP_CREATED, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/professional-services/{id}', name: 'admin_professional_services_update', methods: ['PUT'])]
    public function update(Request $request, ProfessionalService $service): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $service->setTitle($data['title']);
            $service->setDescription($data['description']);

            // Handle image upload if new image is provided
            if (isset($data['image']) && $data['image'] !== $service->getImage()) {
                // Delete old image if exists
                $oldImagePath = $this->getParameter('kernel.project_dir') . '/public' . $service->getImage();
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }

                $imagePath = $this->handleImageUpload($data['image']);
                $service->setImage($imagePath);
            }

            if (isset($data['published'])) {
                $service->setPublished($data['published']);
            }

            $this->entityManager->flush();

            $response = $this->serializer->serialize($service, 'json', ['groups' => 'professional_service:read']);
            return new JsonResponse($response, Response::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/professional-services/{id}', name: 'admin_professional_services_delete', methods: ['DELETE'])]
    public function delete(ProfessionalService $service): JsonResponse
    {
        try {
            // Delete the image file if it exists
            if ($service->getImage()) {
                $imagePath = $this->getParameter('kernel.project_dir') . '/public' . $service->getImage();
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $this->entityManager->remove($service);
            $this->entityManager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/professional-services/{id}/toggle-publish', name: 'admin_professional_services_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(ProfessionalService $service): JsonResponse
    {
        $service->setPublished(!$service->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($service, 'json', ['groups' => 'professional_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
