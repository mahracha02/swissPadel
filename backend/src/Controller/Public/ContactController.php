<?php

namespace App\Controller\Public;

use App\Entity\Contacts;
use App\Repository\ObjetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api')]
class ContactController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ObjetRepository $objetRepository
    ) {}

    #[Route('/contact/new', name: 'contact_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $contact = new Contacts();
            $contact->setFullName($data['fullName']);
            $contact->setEmail($data['email']);
            $contact->setMessage($data['message']);
            $contact->setStatus(null); // Default status is null

            // Set the object if provided
            if (isset($data['object']) && is_numeric($data['object'])) {
                $object = $this->objetRepository->find($data['object']);
                if ($object) {
                    $contact->setObject($object);
                }
            }

            $this->entityManager->persist($contact);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Message sent successfully'], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}
