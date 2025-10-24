import { MigrationInterface, QueryRunner } from "typeorm";

export class AmoContactsTable1761343593410 implements MigrationInterface {
    name = 'AmoContactsTable1761343593410'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "amo_contacts" ("id" integer NOT NULL, "name" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "email" character varying, "phone" character varying, "responsible_user_id" integer, "account_id" character varying NOT NULL, "amo_created_at" bigint, "amo_updated_at" bigint, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_36e8f7c665454aaa103be2a5a85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leads" ADD "amo_contact_id" integer`);
        await queryRunner.query(`ALTER TABLE "amo_contacts" ADD CONSTRAINT "FK_b2d80be0256228710f83b192d0c" FOREIGN KEY ("responsible_user_id") REFERENCES "amo_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_fe72e671530808b38a8d6675f50" FOREIGN KEY ("amo_contact_id") REFERENCES "amo_contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_fe72e671530808b38a8d6675f50"`);
        await queryRunner.query(`ALTER TABLE "amo_contacts" DROP CONSTRAINT "FK_b2d80be0256228710f83b192d0c"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "amo_contact_id"`);
        await queryRunner.query(`DROP TABLE "amo_contacts"`);
    }

}
