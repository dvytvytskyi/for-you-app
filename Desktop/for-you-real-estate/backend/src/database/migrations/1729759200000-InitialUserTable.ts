import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialUserTable1729759200000 implements MigrationInterface {
  name = 'InitialUserTable1729759200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM('CLIENT', 'BROKER', 'INVESTOR', 'ADMIN');
    `);

    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM('PENDING', 'ACTIVE', 'BLOCKED', 'REJECTED');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'CLIENT',
        "status" "user_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "license_number" character varying,
        "google_id" character varying,
        "apple_id" character varying,
        "avatar" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_phone" UNIQUE ("phone"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_email" ON "users" ("email");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_phone" ON "users" ("phone");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_role" ON "users" ("role");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_users_status" ON "users" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_status"`);
    await queryRunner.query(`DROP INDEX "IDX_users_role"`);
    await queryRunner.query(`DROP INDEX "IDX_users_phone"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}

