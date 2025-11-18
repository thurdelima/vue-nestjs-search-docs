import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateDocumentsTable1734567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "document_type_enum" AS ENUM ('CPF', 'CNPJ');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "documents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "number" varchar(14) NOT NULL UNIQUE,
        "type" "document_type_enum" NOT NULL,
        "isBlocklisted" boolean NOT NULL DEFAULT false,
        "createdAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW."updatedAt" = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_documents_updated_at ON "documents";
      CREATE TRIGGER update_documents_updated_at
      BEFORE UPDATE ON "documents"
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    `);

    await queryRunner.createIndex(
      'documents',
      new TableIndex({
        name: 'IDX_documents_number',
        columnNames: ['number'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS update_documents_updated_at ON "documents";
    `);

    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `);

    await queryRunner.dropIndex('documents', 'IDX_documents_number');

    await queryRunner.dropTable('documents');

    await queryRunner.query(`DROP TYPE IF EXISTS "document_type_enum"`);
  }
}

