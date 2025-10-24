import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  CLIENT = 'CLIENT',
  BROKER = 'BROKER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

