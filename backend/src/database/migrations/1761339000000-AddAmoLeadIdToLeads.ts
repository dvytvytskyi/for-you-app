import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmoLeadIdToLeads1761339000000 implements MigrationInterface {
  name = 'AddAmoLeadIdToLeads1761339000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leads" 
      ADD COLUMN "amoLeadId" integer NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_leads_amoLeadId" ON "leads" ("amoLeadId")
    `);

    await queryRunner.query(`
      COMMENT ON COLUMN "leads"."amoLeadId" IS 'AMO CRM Lead ID for two-way sync'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_leads_amoLeadId"`);
    await queryRunner.query(`ALTER TABLE "leads" DROP COLUMN "amoLeadId"`);
  }
}

