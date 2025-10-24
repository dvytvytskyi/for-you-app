import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBrokerClientDto {
  @ApiProperty({ description: 'Ім\'я клієнта' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Телефон' })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Джерело', example: 'додаток' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Мітки', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Нотатки' })
  @IsOptional()
  @IsString()
  notes?: string;
}

