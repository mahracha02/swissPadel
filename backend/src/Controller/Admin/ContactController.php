<?php

namespace App\Controller\Admin;

use App\Entity\Contacts;
use App\Repository\ContactsRepository;
use App\Repository\ObjetRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/admin')]
class ContactController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ContactsRepository $contactsRepository,
        private ObjetRepository $objetRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/contacts', name: 'admin_contacts_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $contacts = $this->contactsRepository->findAll();

        // Map entities to array
        $data = array_map(function ($contact) {
            return [
                'id' => $contact->getId(),
                'fullName' => $contact->getFullName(),
                'email' => $contact->getEmail(),
                'message' => $contact->getMessage(),
                'status' => $contact->isStatus(),
                'object' => $contact->getObject() ? [
                    'id' => $contact->getObject()->getId(),
                    'type' => $contact->getObject()->getType()
                ] : null,
            ];
        }, $contacts);
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'contact:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/contacts/{id}', name: 'admin_contacts_update', methods: ['PUT'])]
    public function update(Request $request, Contacts $contact): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['fullName'])) {
            $contact->setFullName($data['fullName']);
        }
        if (isset($data['email'])) {
            $contact->setEmail($data['email']);
        }
        if (isset($data['message'])) {
            $contact->setMessage($data['message']);
        }
        if (array_key_exists('status', $data)) {
            $contact->setStatus($data['status']);
        }

        $this->entityManager->flush();

        // Map the updated contact to array
        $responseData = [
            'id' => $contact->getId(),
            'fullName' => $contact->getFullName(),
            'email' => $contact->getEmail(),
            'message' => $contact->getMessage(),
            'status' => $contact->isStatus(),
            'object' => $contact->getObject() ? [
                'id' => $contact->getObject()->getId(),
                'type' => $contact->getObject()->getType()
            ] : null,
        ];

        $response = $this->serializer->serialize($responseData, 'json', ['groups' => 'contact:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/contacts/{id}', name: 'admin_contacts_delete', methods: ['DELETE'])]
    public function delete(Contacts $contact): JsonResponse
    {
        $this->entityManager->remove($contact);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/contacts/{id}/toggle-status', name: 'admin_contacts_toggle_status', methods: ['PATCH'])]
    public function toggleStatus(Contacts $contact): JsonResponse
    {
        $contact->setStatus(!$contact->isStatus());
        $this->entityManager->flush();

        $response = $this->serializer->serialize($contact, 'json', ['groups' => 'contact:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }
}
