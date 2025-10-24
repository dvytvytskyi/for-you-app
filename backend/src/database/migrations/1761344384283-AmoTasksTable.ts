import { MigrationInterface, QueryRunner } from "typeorm";

export class AmoTasksTable1761344384283 implements MigrationInterface {
    name = 'AmoTasksTable1761344384283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "amo_tasks" ("id" integer NOT NULL, "text" text NOT NULL, "task_type_id" integer NOT NULL DEFAULT '1', "complete_till" bigint NOT NULL, "is_completed" boolean NOT NULL DEFAULT false, "responsible_user_id" integer NOT NULL, "entity_id" integer, "entity_type" character varying, "duration" integer, "result_text" text, "created_by" integer, "updated_by" integer, "amo_created_at" bigint, "amo_updated_at" bigint, "account_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_213a97ab0a24a150981af425328" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "amo_tasks" ADD CONSTRAINT "FK_6f7706f858eb78fd152880af7bc" FOREIGN KEY ("responsible_user_id") REFERENCES "amo_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "amo_tasks" DROP CONSTRAINT "FK_6f7706f858eb78fd152880af7bc"`);
        await queryRunner.query(`DROP TABLE "amo_tasks"`);
    }

}
