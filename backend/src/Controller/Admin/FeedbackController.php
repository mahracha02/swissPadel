<?php

namespace App\Controller\Admin;

use App\Entity\Feedback;
use App\Repository\FeedbackRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/admin')]
class FeedbackController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private FeedbackRepository $feedbackRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/feedback', name: 'admin_feedback_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $feedbackItems = $this->feedbackRepository->findAll();
        $data = $this->serializer->serialize($feedbackItems, 'json', ['groups' => 'feedback:read']);
        return new JsonResponse($data, Response::HTTP_OK, [], true);
    }

    #[Route('/feedback', name: 'admin_feedback_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $feedback = new Feedback();
        $feedback->setFullName($data['fullName']);
        $feedback->setMessage($data['message']);
        $feedback->setImage($data['image'] ?? null);
        $feedback->setPublished($data['published'] ?? false);

        $this->entityManager->persist($feedback);
        $this->entityManager->flush();

        $response = $this->serializer->serialize($feedback, 'json', ['groups' => 'feedback:read']);
        return new JsonResponse($response, Response::HTTP_CREATED, [], true);
    }

    #[Route('/feedback/{id}', name: 'admin_feedback_update', methods: ['PUT'])]
    public function update(Request $request, Feedback $feedback): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $feedback->setFullName($data['fullName']);
        $feedback->setMessage($data['message']);
        if (isset($data['image'])) {
            $feedback->setImage($data['image']);
        }
        if (isset($data['published'])) {
            $feedback->setPublished($data['published']);
        }

        $this->entityManager->flush();

        $response = $this->serializer->serialize($feedback, 'json', ['groups' => 'feedback:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/feedback/{id}', name: 'admin_feedback_delete', methods: ['DELETE'])]
    public function delete(Feedback $feedback): JsonResponse
    {
        $this->entityManager->remove($feedback);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/feedback/{id}/toggle-publish', name: 'admin_feedback_toggle_publish', methods: ['PATCH'])]
    public function togglePublish(Feedback $feedback): JsonResponse
    {
        $feedback->setPublished(!$feedback->isPublished());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($feedback, 'json', ['groups' => 'feedback:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
