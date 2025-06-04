<?php

namespace App\Controller\Public;

use App\Repository\SponsorsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class SponsorController extends AbstractController
{
    public function __construct(
        private SponsorsRepository $sponsorRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/sponsors', name: 'sponsors_published', methods: ['GET'])]
    public function publishedSponsors(): JsonResponse
    {
        $sponsors = $this->sponsorRepository->findBy(['published' => true]);
        if (!$sponsors) {
            return new JsonResponse(['message' => 'No published sponsors found'], Response::HTTP_NOT_FOUND);
        }
        // Map entities to array
        $data = array_map(function ($sponsor) {
            return [
                'id' => $sponsor->getId(),
                'name' => $sponsor->getName(),
                'description' => $sponsor->getDescription(),
                'image' => $sponsor->getImage(),
                'siteUrl' => $sponsor->getSiteUrl(),
            ];
        }, $sponsors);
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'sponsor:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/sponsors/{id}', name: 'sponsors_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $sponsor = $this->sponsorRepository->find($id);

        if (!$sponsor || !$sponsor->isPublished()) {
            return new JsonResponse(['message' => 'Sponsor not found'], Response::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $sponsor->getId(),
            'name' => $sponsor->getName(),
            'description' => $sponsor->getDescription(),
            'logo' => $sponsor->getLogo(),
            'website' => $sponsor->getWebsite(),
        ];

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'sponsor:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
