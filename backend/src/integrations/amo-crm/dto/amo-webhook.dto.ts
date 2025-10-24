import { IsOptional, IsObject } from 'class-validator';

export class AmoWebhookDto {
  @IsOptional()
  @IsObject()
  leads?: any;

  @IsOptional()
  @IsObject()
  contacts?: any;

  @IsOptional()
  @IsObject()
  account?: {
    id: string;
    subdomain: string;
  };
}

