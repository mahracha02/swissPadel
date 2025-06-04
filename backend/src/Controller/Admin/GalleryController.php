<?php

namespace App\Controller\Admin;

use App\Entity\Gallery;
use App\Repository\GalleryRepository;
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
class GalleryController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private GalleryRepository $galleryRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/gallery/';
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
        return '/uploads/gallery/' . $newFilename;
    }

    #[Route('/gallery', name: 'admin_gallery_list', methods: ['GET'])]
    public function allGallery(): JsonResponse
    {
        $galleryItems = $this->galleryRepository->findAll();

        // map entities to array
        $data = array_map(function ($item) {
            return [
                'id' => $item->getId(),
                'title' => $item->getTitle(),
                'description' => $item->getDescription(),
                'image' => $item->getImage(),
                'published' => $item->isPublished(),
            ];
        }, $galleryItems);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'gallery:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/gallery', name: 'admin_gallery_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $galleryItem = new Gallery();
            $galleryItem->setTitle($data['title']);
            $galleryItem->setDescription($data['description']);

            // Handle image upload
            if (isset($data['image'])) {
                $imagePath = $this->handleImageUpload($data['image']);
                $galleryItem->setImage($imagePath);
            }

            $galleryItem->setPublished($data['published'] ?? false);

            $this->entityManager->persist($galleryItem);
            $this->entityManager->flush();

            $response = $this->serializer->serialize($galleryItem, 'json', ['groups' => 'gallery:read']);
            return new JsonResponse($response, Response::HTTP_CREATED, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/gallery/{id}', name: 'admin_gallery_update', methods: ['PUT'])]
    public function update(Request $request, Gallery $galleryItem): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $galleryItem->setTitle($data['title']);
            $galleryItem->setDescription($data['description']);

            // Handle image upload if new image is provided
            if (isset($data['image']) && $data['image'] !== $galleryItem->getImage()) {
                // Delete old image if exists
                $oldImagePath = $this->params->get('kernel.project_dir') . '/public' . $galleryItem->getImage();
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }

                $imagePath = $this->handleImageUpload($data['image']);
                $galleryItem->setImage($imagePath);
            }

            if (isset($data['published'])) {
                $galleryItem->setPublished($data['published']);
            }

            $this->entityManager->flush();

            $response = $this->serializer->serialize($galleryItem, 'json', ['groups' => 'gallery:read']);
            return new JsonResponse($response, Response::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/gallery/{id}', name: 'admin_gallery_delete', methods: ['DELETE'])]
    public function delete(Gallery $galleryItem): JsonResponse
    {
        try {
            // Delete the image file if it exists
            if ($galleryItem->getImage()) {
                $imagePath = $this->params->get('kernel.project_dir') . '/public' . $galleryItem->getImage();
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $this->entityManager->remove($galleryItem);
            $this->entityManager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/gallery/{id}/toggle-publish', name: 'admin_gallery_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(Gallery $galleryItem): JsonResponse
    {
        $galleryItem->setPublished(!$galleryItem->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($galleryItem, 'json', ['groups' => 'gallery:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
