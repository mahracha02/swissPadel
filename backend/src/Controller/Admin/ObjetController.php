<?php

namespace App\Controller\Admin;

use App\Entity\Objet;
use App\Repository\ObjetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/admin')]
class ObjetController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ObjetRepository $objetRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/objects', name: 'admin_objects_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $objects = $this->objetRepository->findAll();

        // Map entities to array
        $data = array_map(function ($object) {
            return [
                'id' => $object->getId(),
                'type' => $object->getType(),
                'contacts' => $object->getContacts()->count(),
            ];
        }, $objects);
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'object:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/objects/{id}', name: 'admin_objects_show', methods: ['GET'])]
    public function show(Objet $object): JsonResponse
    {
        $object = $this->objetRepository->find($object->getId());
        $response = $this->serializer->serialize($object, 'json', ['groups' => 'object:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/objects', name: 'admin_objects_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $object = new Objet();
        $object->setType($data['type']);

        $this->entityManager->persist($object);
        $this->entityManager->flush();

        $response = $this->serializer->serialize($object, 'json', ['groups' => 'object:read']);
        return new JsonResponse($response, Response::HTTP_CREATED, [], true);
    }

    #[Route('/objects/{id}', name: 'admin_objects_update', methods: ['PUT'])]
    public function update(Request $request, Objet $object): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $object->setType($data['type']);

        $this->entityManager->flush();

        $response = $this->serializer->serialize($object, 'json', ['groups' => 'object:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/objects/{id}', name: 'admin_objects_delete', methods: ['DELETE'])]
    public function delete(Objet $object): JsonResponse
    {
        // Check if the object has any associated contacts
        if ($object->getContacts()->count() > 0) {
            return new JsonResponse(
                ['message' => 'Cannot delete object with associated contacts'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $this->entityManager->remove($object);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
