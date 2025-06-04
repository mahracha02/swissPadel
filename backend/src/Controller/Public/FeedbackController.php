<?php

namespace App\Controller\Public;

use App\Entity\Feedback;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class FeedbackController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer
    ) {}

    #[Route('/feedback', name: 'feedback_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $feedback = new Feedback();
            $feedback->setName($data['name']);
            $feedback->setEmail($data['email']);
            $feedback->setMessage($data['message']);
            $feedback->setRating($data['rating']);

            $this->entityManager->persist($feedback);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Feedback submitted successfully'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
