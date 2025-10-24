import { MigrationInterface, QueryRunner } from "typeorm";

export class AmoPipelinesStagesTables1761342395711 implements MigrationInterface {
    name = 'AmoPipelinesStagesTables1761342395711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_leads_amo_lead_id"`);
        await queryRunner.query(`CREATE TABLE "amo_pipelines" ("id" integer NOT NULL, "name" character varying NOT NULL, "sort" integer NOT NULL DEFAULT '0', "is_main" boolean NOT NULL DEFAULT false, "is_unsorted_on" boolean NOT NULL DEFAULT true, "account_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d118139037aaf6ad56ea1446285" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."amo_stages_mapped_status_enum" AS ENUM('NEW', 'IN_PROGRESS', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "amo_stages" ("id" integer NOT NULL, "pipeline_id" integer NOT NULL, "name" character varying NOT NULL, "sort" integer NOT NULL DEFAULT '0', "is_editable" boolean NOT NULL DEFAULT true, "color" character varying, "mapped_status" "public"."amo_stages_mapped_status_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2818d9c34199f0424419757c1f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "amo_deal_id"`);
        await queryRunner.query(`COMMENT ON COLUMN "leads"."amo_lead_id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "amo_stages" ADD CONSTRAINT "FK_f6462fac73ef69300e6d67e7dfa" FOREIGN KEY ("pipeline_id") REFERENCES "amo_pipelines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "amo_stages" DROP CONSTRAINT "FK_f6462fac73ef69300e6d67e7dfa"`);
        await queryRunner.query(`COMMENT ON COLUMN "leads"."amo_lead_id" IS 'AMO CRM Lead ID for two-way sync'`);
        await queryRunner.query(`ALTER TABLE "leads" ADD "amo_deal_id" bigint`);
        await queryRunner.query(`DROP TABLE "amo_stages"`);
        await queryRunner.query(`DROP TYPE "public"."amo_stages_mapped_status_enum"`);
        await queryRunner.query(`DROP TABLE "amo_pipelines"`);
        await queryRunner.query(`CREATE INDEX "IDX_leads_amo_lead_id" ON "leads" ("amo_lead_id") `);
    }

}
