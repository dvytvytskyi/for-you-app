import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '../../database/entities/lead.entity';

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'Статус заявки', enum: LeadStatus })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'ID призначеного брокера' })
  @IsOptional()
  @IsUUID()
  brokerId?: string;

  @ApiPropertyOptional({ description: 'Коментар/нотатки брокера' })
  @IsOptional()
  @IsString()
  comment?: string;
}

