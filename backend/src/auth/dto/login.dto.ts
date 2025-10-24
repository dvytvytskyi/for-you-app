import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  emailOrPhone: string; // Можна логінитись через email або phone

  @IsString()
  password: string;
}

