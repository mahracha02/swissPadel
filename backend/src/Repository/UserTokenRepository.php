<?php

namespace App\Repository;

use App\Entity\UserToken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserToken::class);
    }

    public function findValidToken(string $token): ?UserToken
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.token = :token')
            ->andWhere('t.isValid = :isValid')
            ->andWhere('t.expiresAt > :now')
            ->setParameter('token', $token)
            ->setParameter('isValid', true)
            ->setParameter('now', new \DateTimeImmutable())
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function invalidateUserTokens(int $userId): void
    {
        $this->createQueryBuilder('t')
            ->update()
            ->set('t.isValid', ':isValid')
            ->where('t.user = :userId')
            ->andWhere('t.isValid = :currentValid')
            ->setParameter('isValid', false)
            ->setParameter('userId', $userId)
            ->setParameter('currentValid', true)
            ->getQuery()
            ->execute();
    }
}
