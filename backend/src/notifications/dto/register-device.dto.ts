import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DevicePlatform } from '../../database/entities/user-device.entity';

export class RegisterDeviceDto {
  @ApiProperty({ description: 'Firebase FCM токен пристрою' })
  @IsString()
  fcmToken: string;

  @ApiProperty({ enum: DevicePlatform, description: 'Платформа пристрою' })
  @IsEnum(DevicePlatform)
  platform: DevicePlatform;

  @ApiPropertyOptional({ description: 'Модель пристрою' })
  @IsOptional()
  @IsString()
  deviceModel?: string;

  @ApiPropertyOptional({ description: 'Версія ОС' })
  @IsOptional()
  @IsString()
  osVersion?: string;

  @ApiPropertyOptional({ description: 'Версія додатку' })
  @IsOptional()
  @IsString()
  appVersion?: string;
}

