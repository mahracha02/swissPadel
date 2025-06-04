<?php

namespace App\Controller\Public;

use App\Repository\GalleryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class GalleryController extends AbstractController
{
    public function __construct(
        private GalleryRepository $galleryRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/gallery', name: 'gallery_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $images = $this->galleryRepository->findBy(['published' => true]);

        $data = array_map(function ($image) {
            return [
                'id' => $image->getId(),
                'title' => $image->getTitle(),
                'description' => $image->getDescription(),
                'image' => $image->getImage(),
            ];
        }, $images);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'gallery:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/gallery/{id}', name: 'gallery_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $image = $this->galleryRepository->find($id);

        if (!$image || !$image->isPublished()) {
            return new JsonResponse(['message' => 'Image not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $image->getId(),
            'title' => $image->getTitle(),
            'description' => $image->getDescription(),
            'image' => $image->getImage(),
            'createdAt' => $image->getCreatedAt()->format('Y-m-d H:i:s'),
        ];

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'gallery:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
