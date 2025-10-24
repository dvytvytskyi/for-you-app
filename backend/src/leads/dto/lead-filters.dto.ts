import { IsOptional, IsEnum, IsUUID, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '../../database/entities/lead.entity';

export class LeadFiltersDto {
  @ApiPropertyOptional({ description: 'Номер сторінки', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Кількість на сторінці', example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Статус заявки', enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'ID брокера' })
  @IsOptional()
  @IsUUID()
  brokerId?: string;

  @ApiPropertyOptional({ description: 'ID клієнта' })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ description: 'ID нерухомості' })
  @IsOptional()
  @IsUUID()
  propertyId?: string;
}

