import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncLogsTable1761347115810 implements MigrationInterface {
    name = 'SyncLogsTable1761347115810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sync_logs_type_enum" AS ENUM('PROPERTIES', 'MANUAL', 'SCHEDULED')`);
        await queryRunner.query(`CREATE TYPE "public"."sync_logs_status_enum" AS ENUM('SUCCESS', 'PARTIAL', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "sync_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."sync_logs_type_enum" NOT NULL DEFAULT 'PROPERTIES', "status" "public"."sync_logs_status_enum" NOT NULL, "created_count" integer NOT NULL DEFAULT '0', "updated_count" integer NOT NULL DEFAULT '0', "archived_count" integer NOT NULL DEFAULT '0', "failed_count" integer NOT NULL DEFAULT '0', "total_processed" integer NOT NULL DEFAULT '0', "duration_ms" integer, "error_message" text, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f441fe15484e077c80ddec89336" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sync_logs"`);
        await queryRunner.query(`DROP TYPE "public"."sync_logs_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."sync_logs_type_enum"`);
    }

}
