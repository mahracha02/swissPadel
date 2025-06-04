<?php

namespace App\Controller\Admin;

use App\Entity\ParticularService;
use App\Repository\ParticularServiceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/admin')]
class ParticularServiceController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ParticularServiceRepository $particularServiceRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/particular-services', name: 'admin_particular_services_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $services = $this->particularServiceRepository->findAll();
        $data = $this->serializer->serialize($services, 'json', ['groups' => 'particular_service:read']);
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/particular-services', name: 'admin_particular_services_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $service = new ParticularService();
        $service->setTitle($data['title']);
        $service->setDescription($data['description'] ?? null);
        $service->setImage($data['image'] ?? null);
        $service->setPublished($data['published'] ?? false);

        $this->entityManager->persist($service);
        $this->entityManager->flush();

        $response = $this->serializer->serialize($service, 'json', ['groups' => 'particular_service:read']);
        return new JsonResponse($response, Response::HTTP_CREATED, [], true);
    }

    #[Route('/particular-services/{id}', name: 'admin_particular_services_update', methods: ['PUT'])]
    public function update(Request $request, ParticularService $service): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $service->setTitle($data['title']);
        if (isset($data['description'])) {
            $service->setDescription($data['description']);
        }
        if (isset($data['image'])) {
            $service->setImage($data['image']);
        }
        if (isset($data['published'])) {
            $service->setPublished($data['published']);
        }

        $this->entityManager->flush();

        $response = $this->serializer->serialize($service, 'json', ['groups' => 'particular_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/particular-services/{id}', name: 'admin_particular_services_delete', methods: ['DELETE'])]
    public function delete(ParticularService $service): JsonResponse
    {
        $this->entityManager->remove($service);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/particular-services/{id}/toggle-publish', name: 'admin_particular_services_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(ParticularService $service): JsonResponse
    {
        $service->setPublished(!$service->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($service, 'json', ['groups' => 'particular_service:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
