import { MigrationInterface, QueryRunner } from "typeorm";

export class NotificationsTables1761345957062 implements MigrationInterface {
    name = 'NotificationsTables1761345957062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_devices_platform_enum" AS ENUM('ios', 'android', 'web')`);
        await queryRunner.query(`CREATE TABLE "user_devices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "fcm_token" text NOT NULL, "platform" "public"."user_devices_platform_enum" NOT NULL DEFAULT 'android', "device_model" character varying, "os_version" character varying, "app_version" character varying, "is_active" boolean NOT NULL DEFAULT true, "last_used_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c9e7e648903a9e537347aba4371" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_69243dce2f0618da5c6051a9ad" ON "user_devices" ("user_id", "fcm_token") `);
        await queryRunner.query(`CREATE TABLE "notification_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "push_enabled" boolean NOT NULL DEFAULT true, "email_enabled" boolean NOT NULL DEFAULT true, "lead_created" boolean NOT NULL DEFAULT true, "lead_assigned" boolean NOT NULL DEFAULT true, "lead_status_changed" boolean NOT NULL DEFAULT true, "new_property" boolean NOT NULL DEFAULT true, "price_changed" boolean NOT NULL DEFAULT true, "favorite_property_updated" boolean NOT NULL DEFAULT true, "new_exclusive_property" boolean NOT NULL DEFAULT true, "system_notifications" boolean NOT NULL DEFAULT true, "marketing_notifications" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_91a7ffebe8b406c4470845d4781" UNIQUE ("user_id"), CONSTRAINT "REL_91a7ffebe8b406c4470845d478" UNIQUE ("user_id"), CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_history_type_enum" AS ENUM('lead_created', 'lead_assigned', 'lead_status_changed', 'new_property', 'price_changed', 'new_exclusive_property', 'system', 'marketing')`);
        await queryRunner.query(`CREATE TABLE "notification_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "public"."notification_history_type_enum" NOT NULL, "title" character varying NOT NULL, "body" text NOT NULL, "data" jsonb, "image_url" character varying, "is_read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP, "is_sent" boolean NOT NULL DEFAULT false, "sent_at" TIMESTAMP, "error_message" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_901f37d36fcc63dffdc1281d6bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_65bb163f315f8bc642a706db6a" ON "notification_history" ("user_id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be1055bf99ca49c468524a850" ON "notification_history" ("user_id", "is_read") `);
        await queryRunner.query(`ALTER TABLE "user_devices" ADD CONSTRAINT "FK_28bd79e1b3f7c1168f0904ce241" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_settings" ADD CONSTRAINT "FK_91a7ffebe8b406c4470845d4781" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification_history" ADD CONSTRAINT "FK_727a17e812879626235bc06cbe3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_history" DROP CONSTRAINT "FK_727a17e812879626235bc06cbe3"`);
        await queryRunner.query(`ALTER TABLE "notification_settings" DROP CONSTRAINT "FK_91a7ffebe8b406c4470845d4781"`);
        await queryRunner.query(`ALTER TABLE "user_devices" DROP CONSTRAINT "FK_28bd79e1b3f7c1168f0904ce241"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4be1055bf99ca49c468524a850"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_65bb163f315f8bc642a706db6a"`);
        await queryRunner.query(`DROP TABLE "notification_history"`);
        await queryRunner.query(`DROP TYPE "public"."notification_history_type_enum"`);
        await queryRunner.query(`DROP TABLE "notification_settings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_69243dce2f0618da5c6051a9ad"`);
        await queryRunner.query(`DROP TABLE "user_devices"`);
        await queryRunner.query(`DROP TYPE "public"."user_devices_platform_enum"`);
    }

}
