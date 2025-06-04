<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250529160725 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE contacts ADD object_id INT NOT NULL, ADD published TINYINT(1) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contacts ADD CONSTRAINT FK_33401573232D562B FOREIGN KEY (object_id) REFERENCES objet (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_33401573232D562B ON contacts (object_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE contacts DROP FOREIGN KEY FK_33401573232D562B
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_33401573232D562B ON contacts
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE contacts DROP object_id, DROP published
        SQL);
    }
}
