/**
 * User Types - matching backend entities
 */

export enum UserRole {
  BROKER = 'BROKER',
  INVESTOR = 'INVESTOR',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status?: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'REJECTED'; // Адмін-панель використовує status
  isActive?: boolean; // Застаріле, використовується status
  isEmailVerified?: boolean;
  licenseNumber?: string | null;
  avatar?: string | null;
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
  whatsapp?: string | null;
  telegram?: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

