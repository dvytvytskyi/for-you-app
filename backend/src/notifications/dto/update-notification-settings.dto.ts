import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationSettingsDto {
  @ApiPropertyOptional({ description: 'Вмикає/вимикає push-сповіщення' })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Вмикає/вимикає email-сповіщення' })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про створення заявки' })
  @IsOptional()
  @IsBoolean()
  leadCreated?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про призначення заявки' })
  @IsOptional()
  @IsBoolean()
  leadAssigned?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про зміну статусу заявки' })
  @IsOptional()
  @IsBoolean()
  leadStatusChanged?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про нову нерухомість' })
  @IsOptional()
  @IsBoolean()
  newProperty?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про зміну ціни' })
  @IsOptional()
  @IsBoolean()
  priceChanged?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про оновлення обраної нерухомості' })
  @IsOptional()
  @IsBoolean()
  favoritePropertyUpdated?: boolean;

  @ApiPropertyOptional({ description: 'Сповіщення про нову ексклюзивну нерухомість' })
  @IsOptional()
  @IsBoolean()
  newExclusiveProperty?: boolean;

  @ApiPropertyOptional({ description: 'Системні сповіщення' })
  @IsOptional()
  @IsBoolean()
  systemNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Маркетингові сповіщення' })
  @IsOptional()
  @IsBoolean()
  marketingNotifications?: boolean;
}

