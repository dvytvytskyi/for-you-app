import { MigrationInterface, QueryRunner } from "typeorm";

export class FavoritesTable1761297659673 implements MigrationInterface {
    name = 'FavoritesTable1761297659673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorites" ("user_id" uuid NOT NULL, "property_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca292e89ddb91e78ca404a0d268" PRIMARY KEY ("user_id", "property_id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ca292e89ddb91e78ca404a0d26" ON "favorites" ("user_id", "property_id") `);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD CONSTRAINT "FK_6c9d2059f4ae253c262de11bba0" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_6c9d2059f4ae253c262de11bba0"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca292e89ddb91e78ca404a0d26"`);
        await queryRunner.query(`DROP TABLE "favorites"`);
    }

}
