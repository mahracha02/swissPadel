<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/admin')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private SerializerInterface $serializer,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('/users', name: 'admin_users_list', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $users = $this->userRepository->findAll();

        // Map entities to array
        $data = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'first_name' => $user->getFirstName(),
                'last_name' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'roles' => $user->getRoles(),
            ];
        }, $users);
        $response = $this->serializer->serialize($data, 'json', ['groups' => 'user:read']);
        return new JsonResponse($response, Response::HTTP_OK, [], true);
    }

    #[Route('/users', name: 'admin_users_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstName($data['first_name']);
        $user->setLastName($data['last_name']);
        $user->setPhone($data['phone']);
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);

        // Hash the password
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $response = $this->serializer->serialize($user, 'json', ['groups' => 'user:read']);
        return new JsonResponse($response, Response::HTTP_CREATED, [], true);
    }

    #[Route('/users/{id}', name: 'admin_users_update', methods: ['PUT'])]
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            // Check if email is being changed and if it already exists
            if (isset($data['email']) && $data['email'] !== $user->getEmail()) {
                $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
                if ($existingUser && $existingUser->getId() !== $user->getId()) {
                    return new JsonResponse(
                        ['error' => 'Cette adresse email est déjà utilisée par un autre utilisateur.'],
                        Response::HTTP_BAD_REQUEST
                    );
                }
            }

            if (isset($data['email'])) {
                $user->setEmail($data['email']);
            }
            if (isset($data['first_name'])) {
                $user->setFirstName($data['first_name']);
            }
            if (isset($data['last_name'])) {
                $user->setLastName($data['last_name']);
            }
            if (isset($data['phone'])) {
                $user->setPhone($data['phone']);
            }
            if (isset($data['roles'])) {
                $user->setRoles($data['roles']);
            }

            // Update password if provided
            if (isset($data['password'])) {
                $hashedPassword = $this->passwordHasher->hashPassword(
                    $user,
                    $data['password']
                );
                $user->setPassword($hashedPassword);
            }

            $this->entityManager->flush();

            $response = $this->serializer->serialize($user, 'json', ['groups' => 'user:read']);
            return new JsonResponse($response, Response::HTTP_OK, [], true);
        } catch (\Exception $e) {
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la mise à jour de l\'utilisateur.'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/users/{id}', name: 'admin_users_delete', methods: ['DELETE'])]
    public function delete(User $user): JsonResponse
    {
        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/users/{id}/change-password', name: 'admin_users_change_password', methods: ['PATCH'])]
    public function changePassword(Request $request, User $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Password updated successfully'], Response::HTTP_OK);
    }
}
