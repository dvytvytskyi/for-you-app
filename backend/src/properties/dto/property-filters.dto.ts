import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '../../database/entities/property.entity';

export class PropertyFiltersDto {
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

  @ApiPropertyOptional({ description: 'Пошук за текстом (title, address, description)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Тип нерухомості', enum: PropertyType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(PropertyType, { each: true })
  type?: PropertyType[];

  @ApiPropertyOptional({ description: 'Мінімальна ціна' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Максимальна ціна' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Тільки ексклюзивні пропозиції' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isExclusive?: boolean;

  @ApiPropertyOptional({ description: 'Показувати продані' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isSoldOut?: boolean;

  @ApiPropertyOptional({ description: 'ID девелопера' })
  @IsOptional()
  @IsString()
  developerId?: string;

  @ApiPropertyOptional({ description: 'Мінімальна кількість будівель' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minBuildings?: number;

  @ApiPropertyOptional({ description: 'Дата завершення будівництва ВІД (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  completionDateFrom?: string;

  @ApiPropertyOptional({ description: 'Дата завершення будівництва ДО (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  completionDateTo?: string;

  @ApiPropertyOptional({ description: 'Райони', isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  districts?: string[];

  @ApiPropertyOptional({ 
    description: 'Сортування', 
    enum: ['price_asc', 'price_desc', 'created_asc', 'created_desc', 'popular', 'completion_asc', 'completion_desc'] 
  })
  @IsOptional()
  @IsString()
  sort?: 'price_asc' | 'price_desc' | 'created_asc' | 'created_desc' | 'popular' | 'completion_asc' | 'completion_desc' = 'created_desc';

  @ApiPropertyOptional({ description: 'Latitude для геопошуку' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude для геопошуку' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Радіус пошуку в метрах (для геопошуку)', example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  radius?: number;
}

