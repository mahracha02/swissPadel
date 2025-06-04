<?php

namespace App\Controller\Public;

use App\Repository\EventsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class EventController extends AbstractController
{
    public function __construct(
        private EventsRepository $eventRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/events', name: 'events_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $events = $this->eventRepository->findBy(['published' => true], ['date' => 'DESC']);

        $data = array_map(function ($event) {
            return [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'description' => $event->getDescription(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'place' => $event->getPlace(),
                'image' => $event->getImage(),
            ];
        }, $events);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'event:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/events/{id}', name: 'events_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);

        if (!$event || !$event->isPublished()) {
            return new JsonResponse(['message' => 'Event not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()->format('Y-m-d H:i:s'),
            'place' => $event->getPlace(),
            'image' => $event->getImage(),
        ];

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'event:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
