import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertiesTables1761297537198 implements MigrationInterface {
    name = 'PropertiesTables1761297537198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_users_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_phone"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_status"`);
        await queryRunner.query(`CREATE TABLE "developers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "logo_url" character varying, "website" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_247719240b950bd26dec14bdd21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "property_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "image_url" character varying NOT NULL, "order_index" integer NOT NULL DEFAULT '0', "is_main" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_317c3774ee70c26d70c4f80e200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_20bd1aa274a574fea020d050fc" ON "property_images" ("property_id", "order_index") `);
        await queryRunner.query(`CREATE TYPE "public"."property_amenities_amenity_type_enum" AS ENUM('indoor', 'outdoor', 'general')`);
        await queryRunner.query(`CREATE TABLE "property_amenities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "amenity_name_en" character varying NOT NULL, "amenity_name_ru" character varying, "amenity_name_ar" character varying, "amenity_type" "public"."property_amenities_amenity_type_enum" NOT NULL DEFAULT 'general', CONSTRAINT "PK_ea41e688338a5af6b8eb12b213a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6002e49cdd5713b05fcd14e6d0" ON "property_amenities" ("property_id") `);
        await queryRunner.query(`CREATE TABLE "payment_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "property_id" uuid NOT NULL, "plan_name" character varying NOT NULL, "down_payment_percent" numeric(5,2) NOT NULL, "installment_years" integer NOT NULL, "description" text, CONSTRAINT "PK_8f05aee900e96c2e0c24df48262" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5bc502fc66b3a1dea35d5f08d0" ON "payment_plans" ("property_id") `);
        await queryRunner.query(`CREATE TYPE "public"."properties_type_enum" AS ENUM('residential_complex', 'villa', 'apartment', 'townhouse', 'penthouse', 'land')`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "external_id" bigint NOT NULL, "type" "public"."properties_type_enum" NOT NULL DEFAULT 'residential_complex', "title_en" character varying NOT NULL, "title_ru" character varying, "title_ar" character varying, "description_en" text, "description_ru" text, "description_ar" text, "status_en" character varying, "status_ru" character varying, "status_ar" character varying, "logo_url" character varying, "main_photo_url" character varying, "location" geography(Point,4326), "latitude" numeric(10,8), "longitude" numeric(11,8), "address" character varying, "districts" jsonb, "min_price" numeric(15,2), "max_price" numeric(15,2), "currency" character varying NOT NULL DEFAULT 'AED', "is_exclusive" boolean NOT NULL DEFAULT false, "is_sold_out" boolean NOT NULL DEFAULT false, "is_archived" boolean NOT NULL DEFAULT false, "buildings_count" integer, "planned_completion_at" TIMESTAMP WITH TIME ZONE, "developer_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_185e77bff62276dd915c8be2198" UNIQUE ("external_id"), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f90c3214044df8bbf79a0ff222" ON "properties" USING GiST ("location") `);
        await queryRunner.query(`CREATE INDEX "IDX_366533255740a7f418d7d2c775" ON "properties" ("max_price") `);
        await queryRunner.query(`CREATE INDEX "IDX_e5a17a28faedc75f9eb58ac96e" ON "properties" ("min_price") `);
        await queryRunner.query(`CREATE INDEX "IDX_49d2198a35b584e70f83645802" ON "properties" ("is_sold_out") `);
        await queryRunner.query(`CREATE INDEX "IDX_0286d7efa6ac2ed46e90dcce17" ON "properties" ("is_exclusive") `);
        await queryRunner.query(`CREATE INDEX "IDX_185e77bff62276dd915c8be219" ON "properties" ("external_id") `);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CLIENT', 'BROKER', 'INVESTOR', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."user_status_enum" RENAME TO "user_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('PENDING', 'ACTIVE', 'BLOCKED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."users_status_enum" USING "status"::"text"::"public"."users_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "property_images" ADD CONSTRAINT "FK_162a7701665354b4751ffb835e4" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_amenities" ADD CONSTRAINT "FK_6002e49cdd5713b05fcd14e6d0a" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment_plans" ADD CONSTRAINT "FK_5bc502fc66b3a1dea35d5f08d0f" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_1c02b2f419b4187956add72ac62" FOREIGN KEY ("developer_id") REFERENCES "developers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_1c02b2f419b4187956add72ac62"`);
        await queryRunner.query(`ALTER TABLE "payment_plans" DROP CONSTRAINT "FK_5bc502fc66b3a1dea35d5f08d0f"`);
        await queryRunner.query(`ALTER TABLE "property_amenities" DROP CONSTRAINT "FK_6002e49cdd5713b05fcd14e6d0a"`);
        await queryRunner.query(`ALTER TABLE "property_images" DROP CONSTRAINT "FK_162a7701665354b4751ffb835e4"`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum_old" AS ENUM('PENDING', 'ACTIVE', 'BLOCKED', 'REJECTED')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" TYPE "public"."user_status_enum_old" USING "status"::"text"::"public"."user_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_status_enum_old" RENAME TO "user_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('CLIENT', 'BROKER', 'INVESTOR', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_185e77bff62276dd915c8be219"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0286d7efa6ac2ed46e90dcce17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49d2198a35b584e70f83645802"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5a17a28faedc75f9eb58ac96e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_366533255740a7f418d7d2c775"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f90c3214044df8bbf79a0ff222"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5bc502fc66b3a1dea35d5f08d0"`);
        await queryRunner.query(`DROP TABLE "payment_plans"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6002e49cdd5713b05fcd14e6d0"`);
        await queryRunner.query(`DROP TABLE "property_amenities"`);
        await queryRunner.query(`DROP TYPE "public"."property_amenities_amenity_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20bd1aa274a574fea020d050fc"`);
        await queryRunner.query(`DROP TABLE "property_images"`);
        await queryRunner.query(`DROP TABLE "developers"`);
        await queryRunner.query(`CREATE INDEX "IDX_users_status" ON "users" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_phone" ON "users" ("phone") `);
        await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email") `);
    }

}
