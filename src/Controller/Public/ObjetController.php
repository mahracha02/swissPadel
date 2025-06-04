<?php

namespace App\Controller\Public;

use App\Repository\ObjetRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class ObjetController extends AbstractController
{
    public function __construct(
        private ObjetRepository $objetRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/objects', name: 'objects_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $objects = $this->objetRepository->findAll();

        if (!$objects) {
            return new JsonResponse(['message' => 'No objects found'], Response::HTTP_NOT_FOUND);
        }
        // Map entities to array
        $data = array_map(function ($object) {
            return [
                'id' => $object->getId(),
                'type' => $object->getType(),
            ];
        }, $objects);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'object:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

}
