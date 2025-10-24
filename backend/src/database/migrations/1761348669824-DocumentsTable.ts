import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentsTable1761348669824 implements MigrationInterface {
    name = 'DocumentsTable1761348669824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."documents_type_enum" AS ENUM('BROCHURE', 'FLOOR_PLAN', 'MASTER_PLAN', 'PROPERTY_CONTRACT', 'PROPERTY_CERTIFICATE', 'LEAD_CONTRACT', 'CLIENT_ID', 'CLIENT_PASSPORT', 'POWER_OF_ATTORNEY', 'BROKER_LICENSE', 'BROKER_CERTIFICATE', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."documents_entity_type_enum" AS ENUM('PROPERTY', 'LEAD', 'USER')`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."documents_type_enum" NOT NULL, "entity_type" "public"."documents_entity_type_enum" NOT NULL, "entity_id" uuid NOT NULL, "property_id" uuid, "lead_id" uuid, "user_id" uuid, "file_name" character varying NOT NULL, "original_name" character varying NOT NULL, "file_url" character varying NOT NULL, "s3_key" character varying NOT NULL, "mime_type" character varying NOT NULL, "file_size" bigint NOT NULL, "description" text, "is_public" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "uploaded_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a178dd7ff45ae611fb232dcee7" ON "documents" ("uploaded_by", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_5bbdbd9b881aa4a7b85e3b574d" ON "documents" ("entity_type", "entity_id") `);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_3048f74b3ef42755b53d9e0b2a8" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_d52cbe10eeba05d828533df74bc" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_c7481daf5059307842edef74d73" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_b9e28779ec77ff2223e2da41f6d" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_b9e28779ec77ff2223e2da41f6d"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_c7481daf5059307842edef74d73"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_d52cbe10eeba05d828533df74bc"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_3048f74b3ef42755b53d9e0b2a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5bbdbd9b881aa4a7b85e3b574d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a178dd7ff45ae611fb232dcee7"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TYPE "public"."documents_entity_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."documents_type_enum"`);
    }

}
