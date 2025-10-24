import { MigrationInterface, QueryRunner } from "typeorm";

export class AmoUsersRolesTables1761342973959 implements MigrationInterface {
    name = 'AmoUsersRolesTables1761342973959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "amo_roles" ("id" integer NOT NULL, "name" character varying NOT NULL, "rights" jsonb, "account_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b0bd2884e3fa029e23e8771dedd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "amo_users" ("id" integer NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "lang" character varying(10) NOT NULL DEFAULT 'ru', "is_admin" boolean NOT NULL DEFAULT false, "is_free" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "role_id" integer, "group_id" integer, "account_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6f5741c93eddad479c1e3dffa4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "amo_users" ADD CONSTRAINT "FK_25cd61deab344492d6de50671fb" FOREIGN KEY ("role_id") REFERENCES "amo_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "amo_users" DROP CONSTRAINT "FK_25cd61deab344492d6de50671fb"`);
        await queryRunner.query(`DROP TABLE "amo_users"`);
        await queryRunner.query(`DROP TABLE "amo_roles"`);
    }

}
