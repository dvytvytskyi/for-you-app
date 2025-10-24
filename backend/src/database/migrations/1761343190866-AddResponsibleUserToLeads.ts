import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResponsibleUserToLeads1761343190866 implements MigrationInterface {
    name = 'AddResponsibleUserToLeads1761343190866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" ADD "responsible_user_id" integer`);
        await queryRunner.query(`ALTER TABLE "leads" ADD CONSTRAINT "FK_fbc7c8f50dd73182b83fe4255e4" FOREIGN KEY ("responsible_user_id") REFERENCES "amo_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leads" DROP CONSTRAINT "FK_fbc7c8f50dd73182b83fe4255e4"`);
        await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "responsible_user_id"`);
    }

}
