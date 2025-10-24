import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeadStatus } from '../../../database/entities/lead.entity';

export class UpdateStageMappingDto {
  @ApiProperty({ enum: LeadStatus, description: 'Статус в нашій системі', nullable: true })
  @IsEnum(LeadStatus)
  @IsNotEmpty()
  mappedStatus: LeadStatus | null;
}

