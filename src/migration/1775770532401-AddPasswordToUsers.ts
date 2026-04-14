import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AddPasswordToUsers1775770532401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "password",
        type: "varchar",
        isNullable: false,
      }),
    );

    // Ajustar a ordem da coluna
    await queryRunner.query(
      `ALTER TABLE users MODIFY COLUMN password varchar(255) AFTER email`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("users", "password");
  }
}
