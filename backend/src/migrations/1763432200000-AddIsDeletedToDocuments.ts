import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from 'typeorm';

export class AddIsDeletedToDocuments1763432200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'documents',
      new TableColumn({
        name: 'isDeleted',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );

    await queryRunner.createIndex(
      'documents',
      new TableIndex({
        name: 'IDX_documents_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('documents', 'IDX_documents_isDeleted');

    await queryRunner.dropColumn('documents', 'isDeleted');
  }
}

