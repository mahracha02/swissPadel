<?php

namespace App\Controller\Public;

use App\Repository\ProfessionalServiceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class ProfessionalServiceController extends AbstractController
{
    public function __construct(
        private ProfessionalServiceRepository $professionalServiceRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/professional-services', name: 'professional_services_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $services = $this->professionalServiceRepository->findBy(['published' => true]);

        //map entities to array
        $data = array_map(function ($service) {
            return [
                'id' => $service->getId(),
                'title' => $service->getTitle(),
                'description' => $service->getDescription(),
                'image' => $service->getImage(),
            ];
        }, $services);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'professional_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/professional-services/{id}', name: 'professional_services_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $service = $this->professionalServiceRepository->find($id);

        if (!$service || !$service->isPublished()) {
            return new JsonResponse(['message' => 'Service not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $service->getId(),
            'title' => $service->getTitle(),
            'description' => $service->getDescription(),
            'image' => $service->getImage(),
        ];

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'professional_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
