import { MigrationInterface, QueryRunner } from "typeorm";

export class LeadsTables1761298037368 implements MigrationInterface {
    name = 'LeadsTables1761298037368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."leads_status_enum" AS ENUM('NEW', 'IN_PROGRESS', 'CLOSED')`);
        await queryRunner.query(`CREATE TYPE "public"."leads_contact_method_enum" AS ENUM('CALL', 'WHATSAPP', 'EMAIL')`);
        await queryRunner.query(`CREATE TYPE "public"."leads_contact_time_enum" AS ENUM('MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME')`);
        await queryRunner.query(`CREATE TABLE "leads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid, "client_id" uuid, "guest_name" character varying, "guest_phone" character varying, "guest_email" character varying, "broker_id" uuid, "status" "public"."leads_status_enum" NOT NULL DEFAULT 'NEW', "comment" text, "contact_method" "public"."leads_contact_method_enum" NOT NULL DEFAULT 'CALL', "contact_time" "public"."leads_contact_time_enum" NOT NULL DEFAULT 'ANYTIME', "amo_deal_id" bigint, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cd102ed7a9a4ca7d4d8bfeba406" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_944e19e85c2bab99936ed42355" ON "leads" ("property_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3815979861f6bb89d1238d76d" ON "leads" ("broker_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_15ec158ab4d5628c673419d4ad" ON "leads" ("client_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_491b018d616822bd64ce7d4726" ON "leads" ("status") `);
        await queryRunner.query(`CREATE TABLE "broker_clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "broker_id" uuid NOT NULL, "name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying, "source" character varying, "tags" jsonb, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc111f3d6ea8696d048ef2a81c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f1df66a05330a6155727c1e0f1" ON "broker_clients" ("broker_id") `);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_944e19e85c2bab99936ed423555" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_15ec158ab4d5628c673419d4ade" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_a3815979861f6bb89d1238d76db" FOREIGN KEY ("broker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "broker_clients" ADD CONSTRAINT "FK_f1df66a05330a6155727c1e0f1e" FOREIGN KEY ("broker_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "broker_clients" DROP CONSTRAINT "FK_f1df66a05330a6155727c1e0f1e"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_a3815979861f6bb89d1238d76db"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_15ec158ab4d5628c673419d4ade"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_944e19e85c2bab99936ed423555"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f1df66a05330a6155727c1e0f1"`);
        await queryRunner.query(`DROP TABLE "broker_clients"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_491b018d616822bd64ce7d4726"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_15ec158ab4d5628c673419d4ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3815979861f6bb89d1238d76d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_944e19e85c2bab99936ed42355"`);
        await queryRunner.query(`DROP TABLE "leads"`);
        await queryRunner.query(`DROP TYPE "public"."leads_contact_time_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leads_contact_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."leads_status_enum"`);
    }

}
