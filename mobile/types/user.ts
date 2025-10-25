/**
 * User Types - matching backend entities
 */

export enum UserRole {
  CLIENT = 'CLIENT',
  BROKER = 'BROKER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Investor specific
  budgetMin?: number;
  budgetMax?: number;
  propertyTypeInterest?: string[];
  purpose?: string;
  preferredLocation?: string;
  
  // Broker specific
  fieldOfExpertise?: string;
  licenseNumber?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

