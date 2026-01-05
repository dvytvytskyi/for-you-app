import { apiClient } from './client';
import { backendApiClient } from './backend-client';
import { AuthResponse, User, UserRole } from '@/types/user';

export interface SignUpGeneralDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string; // Бекенд вимагає phone
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
  licenseNumber?: string; // Для BROKER (обов'язкове на бекенді)
}

export interface LoginDto {
  email: string; // Адмін-панель використовує email
  password: string;
}

export const authApi = {
  // Login
  login: async (data: LoginDto): Promise<any> => {
    try {
      const loginPayload = {
        email: data.email,
        password: data.password,
      };

      console.log('📤 Sending login request to admin panel');
      console.log('🔗 URL:', `${apiClient.defaults.baseURL}/auth/login`);
      console.log('📦 Payload keys:', Object.keys(loginPayload));

      const response = await apiClient.post('/auth/login', loginPayload);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('❌ Login Error Status:', error.response.status);
        console.error('❌ Login Error Data:', JSON.stringify(error.response.data, null, 2));
        console.error('❌ Request Config:', {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
          data: JSON.parse(error.config?.data || '{}')
        });
      }
      throw error;
    }
  },

  // Sign up - General
  signUpGeneral: async (data: SignUpGeneralDto): Promise<AuthResponse> => {
    console.log('📤 Sending sign up general request to admin panel:', { ...data, password: '***' });

    // Використовуємо тільки адмін-панель
    const response = await apiClient.post('/auth/register', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
    });

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
    console.log('📤 Sending sign up agent request to admin panel:', { ...data, password: '***' });

    const licenseNumber = data.licenseNumber || `BROKER-${Date.now()}`;

    // Використовуємо тільки адмін-панель
    const response = await apiClient.post('/auth/register', {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: UserRole.BROKER,
      licenseNumber: licenseNumber,
    });

    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    // Адмін-панель повертає: { success: true, data: { ...user } }
    const response = await apiClient.get('/auth/me');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch user');
    }
    return response.data.data;
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

  // Update profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    avatar?: string;
  }): Promise<User> => {
    console.log('📤 Updating profile:', { ...data, avatar: data.avatar ? '***' : undefined });

    // Використовуємо backendApiClient (admin.foryou-realestate.com/api/v1)
    const response = await backendApiClient.patch('/auth/profile', data);

    console.log('✅ Profile update response:', {
      status: response.status,
      hasData: !!response.data,
      hasUser: !!response.data?.user,
    });

    const responseData = response.data;

    // Локальний бекенд повертає: { user }
    if (responseData?.user) {
      return responseData.user;
    }

    // Якщо дані обгорнуті в data
    if (responseData?.data?.user) {
      return responseData.data.user;
    }

    // Якщо повертається безпосередньо user
    if (responseData && !responseData.user && !responseData.data) {
      return responseData;
    }

    throw new Error('Invalid response format from server');
  },
};

