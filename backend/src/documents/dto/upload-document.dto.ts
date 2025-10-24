import { IsEnum, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, DocumentCategory } from '../../database/entities/document.entity';

export class UploadDocumentDto {
  @ApiProperty({ enum: DocumentType, description: 'Тип документа' })
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty({ enum: DocumentCategory, description: 'Категорія (до чого прив\'язаний)' })
  @IsEnum(DocumentCategory)
  entityType: DocumentCategory;

  @ApiProperty({ description: 'ID сутності (property/lead/user)' })
  @IsUUID()
  entityId: string;

  @ApiPropertyOptional({ description: 'Опис документа' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Чи публічний документ', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

