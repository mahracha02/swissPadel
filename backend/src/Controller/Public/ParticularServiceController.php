<?php

namespace App\Controller\Public;

use App\Repository\ParticularServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class ParticularServiceController extends AbstractController
{
    public function __construct(
        private ParticularServiceRepository $particularServiceRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/particular-services', name: 'particular_services_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $services = $this->particularServiceRepository->findBy(['published' => true], ['title' => 'ASC']);

        $data = array_map(function ($service) {
            return [
                'id' => $service->getId(),
                'title' => $service->getTitle(),
                'description' => $service->getDescription(),
                'image' => $service->getImage(),
            ];
        }, $services);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'particular_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/particular-services/{id}', name: 'particular_services_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $service = $this->particularServiceRepository->find($id);

        if (!$service || !$service->isPublished()) {
            return new JsonResponse(['message' => 'Service not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $service->getId(),
            'title' => $service->getTitle(),
            'description' => $service->getDescription(),
            'image' => $service->getImage(),
        ];

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'particular_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
