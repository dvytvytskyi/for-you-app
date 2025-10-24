import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContactMethod, ContactTime } from '../../database/entities/lead.entity';

export class CreateLeadDto {
  @ApiPropertyOptional({ description: 'ID нерухомості (optional)' })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiPropertyOptional({ description: 'Ім\'я (для guest users)' })
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional({ description: 'Телефон (для guest users)' })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiPropertyOptional({ description: 'Email (для guest users)' })
  @IsOptional()
  @IsString()
  guestEmail?: string;

  @ApiPropertyOptional({ description: 'Коментар від клієнта' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ description: 'Спосіб зв\'язку', enum: ContactMethod, default: ContactMethod.CALL })
  @IsEnum(ContactMethod)
  contactMethod: ContactMethod;

  @ApiProperty({ description: 'Зручний час для зв\'язку', enum: ContactTime, default: ContactTime.ANYTIME })
  @IsEnum(ContactTime)
  contactTime: ContactTime;
}

