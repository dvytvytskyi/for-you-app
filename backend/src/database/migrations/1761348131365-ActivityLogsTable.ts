import { MigrationInterface, QueryRunner } from "typeorm";

export class ActivityLogsTable1761348131365 implements MigrationInterface {
    name = 'ActivityLogsTable1761348131365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."activity_logs_action_enum" AS ENUM('login', 'logout', 'register', 'password_reset', 'user_create', 'user_update', 'user_delete', 'property_create', 'property_update', 'property_delete', 'property_view', 'lead_create', 'lead_update', 'lead_delete', 'lead_status_change', 'lead_assign', 'favorite_add', 'favorite_remove', 'amo_sync', 'xml_sync', 'media_upload', 'media_delete', 'notification_send', 'export', 'import')`);
        await queryRunner.query(`CREATE TYPE "public"."activity_logs_entity_type_enum" AS ENUM('user', 'property', 'lead', 'favorite', 'developer', 'notification', 'media', 'sync', 'system')`);
        await queryRunner.query(`CREATE TABLE "activity_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "action" "public"."activity_logs_action_enum" NOT NULL, "entity_type" "public"."activity_logs_entity_type_enum" NOT NULL, "entity_id" character varying, "description" text, "metadata" jsonb, "ip_address" character varying, "user_agent" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f25287b6140c5ba18d38776a796" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_153c3fec7301b8bcc96a0e1537" ON "activity_logs" ("entity_type", "entity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_03a3ddbf791018859ce1ec18ba" ON "activity_logs" ("action", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_22a8ceffff1ef5bcfdecfe25d3" ON "activity_logs" ("user_id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "activity_logs" ADD CONSTRAINT "FK_d54f841fa5478e4734590d44036" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_logs" DROP CONSTRAINT "FK_d54f841fa5478e4734590d44036"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22a8ceffff1ef5bcfdecfe25d3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03a3ddbf791018859ce1ec18ba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_153c3fec7301b8bcc96a0e1537"`);
        await queryRunner.query(`DROP TABLE "activity_logs"`);
        await queryRunner.query(`DROP TYPE "public"."activity_logs_entity_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."activity_logs_action_enum"`);
    }

}
