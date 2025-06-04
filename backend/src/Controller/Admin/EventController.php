<?php

namespace App\Controller\Admin;

use App\Entity\Events;
use App\Repository\EventsRepository;
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
class EventController extends AbstractController
{
    private string $uploadDir;

    public function __construct(
        private EntityManagerInterface $entityManager,
        private EventsRepository $eventsRepository,
        private SerializerInterface $serializer,
        private SluggerInterface $slugger,
        private ParameterBagInterface $params
    ) {
        $this->uploadDir = $this->params->get('kernel.project_dir') . '/public/uploads/events/';
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
        return '/uploads/events/' . $newFilename;
    }

    #[Route('/events', name: 'admin_events_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $events = $this->eventsRepository->findAll();

        // Map entities to array
        $data = array_map(function ($event) {
            return [
                'id' => $event->getId(),
                'title' => $event->getTitle(),
                'date' => $event->getDate()->format('Y-m-d H:i:s'),
                'description' => $event->getDescription(),
                'place' => $event->getPlace(),
                'image' => $event->getImage(),
                'published' => $event->isPublished(),
            ];
        }, $events);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'event:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/events', name: 'admin_events_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $event = new Events();
            $event->setTitle($data['title']);
            $event->setDate(new \DateTime($data['date']));
            $event->setDescription($data['description']);
            $event->setPlace($data['place']);
            $event->setPublished($data['published'] ?? false);

            // Handle image upload
            if (isset($data['image'])) {
                $imagePath = $this->handleImageUpload($data['image']);
                $event->setImage($imagePath);
            }

            $this->entityManager->persist($event);
            $this->entityManager->flush();

            $response = $this->serializer->serialize($event, 'json', ['groups' => 'event:read']);
            return new JsonResponse($response, Response::HTTP_CREATED, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/events/{id}', name: 'admin_events_update', methods: ['PUT'])]
    public function update(Request $request, Events $event): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $event->setTitle($data['title']);
            $event->setDate(new \DateTime($data['date']));
            $event->setDescription($data['description']);
            $event->setPlace($data['place']);

            // Handle image upload if new image is provided
            if (isset($data['image']) && $data['image'] !== $event->getImage()) {
                // Delete old image if exists
                $oldImagePath = $this->params->get('kernel.project_dir') . '/public' . $event->getImage();
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }

                $imagePath = $this->handleImageUpload($data['image']);
                $event->setImage($imagePath);
            }

            if (isset($data['published'])) {
                $event->setPublished($data['published']);
            }

            $this->entityManager->flush();

            $response = $this->serializer->serialize($event, 'json', ['groups' => 'event:read']);
            return new JsonResponse($response, Response::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/events/{id}', name: 'admin_events_delete', methods: ['DELETE'])]
    public function delete(Events $event): JsonResponse
    {
        try {
            // Delete the image file if it exists
            if ($event->getImage()) {
                $imagePath = $this->params->get('kernel.project_dir') . '/public' . $event->getImage();
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $this->entityManager->remove($event);
            $this->entityManager->flush();

            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    #[Route('/events/{id}/toggle-publish', name: 'admin_events_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(Events $event): JsonResponse
    {
        $event->setPublished(!$event->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($event, 'json', ['groups' => 'event:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
