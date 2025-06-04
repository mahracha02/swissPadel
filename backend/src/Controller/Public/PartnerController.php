<?php

namespace App\Controller\Public;

use App\Repository\PartnersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class PartnerController extends AbstractController
{
    public function __construct(
        private PartnersRepository $partnerRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/partners', name: 'partners_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $partners = $this->partnerRepository->findBy(['published' => true], ['name' => 'ASC']);

        $data = array_map(function ($partner) {
            return [
                'id' => $partner->getId(),
                'name' => $partner->getName(),
                'image' => $partner->getImage(),
                'site_url' => $partner->getSiteUrl(),
            ];
        }, $partners);

        $response = $this->serializer->serialize($data, 'json', ['groups' => 'partner:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

}
