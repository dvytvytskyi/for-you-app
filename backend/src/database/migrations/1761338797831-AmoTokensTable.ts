import { MigrationInterface, QueryRunner } from "typeorm";

export class AmoTokensTable1761338797831 implements MigrationInterface {
    name = 'AmoTokensTable1761338797831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "amo_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" character varying(100) NOT NULL, "accessToken" text NOT NULL, "refreshToken" text NOT NULL, "expiresAt" bigint NOT NULL, "baseDomain" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8c5ddf48dd28e77428b10c52622" UNIQUE ("accountId"), CONSTRAINT "PK_6f27407823d0a9532faf47a37da" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "amo_tokens"`);
    }

}
