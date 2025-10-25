import { apiClient } from './client';
import { AuthResponse, User, UserRole } from '@/types/user';

export interface SignUpGeneralDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface SignUpInvestorDto extends SignUpGeneralDto {
  budgetMin?: number;
  budgetMax?: number;
  propertyTypeInterest?: string[];
  purpose?: string;
  preferredLocation?: string;
}

export interface SignUpAgentDto extends SignUpGeneralDto {
  phone: string;
  whatsapp?: string;
  telegram?: string;
  fieldOfExpertise: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authApi = {
  // Login
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Sign up - General (Client)
  signUpGeneral: async (data: SignUpGeneralDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Sign up - Investor
  signUpInvestor: async (data: SignUpInvestorDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', {
      ...data,
      role: UserRole.INVESTOR,
    });
    return response.data;
  },

  // Sign up - Agent/Broker
  signUpAgent: async (data: SignUpAgentDto): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', {
      ...data,
      role: UserRole.BROKER,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

