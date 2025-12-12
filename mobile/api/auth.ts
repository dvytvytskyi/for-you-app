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
    // Спочатку пробуємо локальний бекенд (він повертає { user, accessToken })
    try {
      console.log('🔄 Trying local backend for login...');
      const backendResponse = await backendApiClient.post('/auth/login', {
        emailOrPhone: data.email, // Backend очікує emailOrPhone
        password: data.password,
      });
      
      console.log('✅ Local backend login response:', {
        status: backendResponse.status,
        hasData: !!backendResponse.data,
        dataKeys: backendResponse.data ? Object.keys(backendResponse.data) : [],
        hasUser: !!backendResponse.data?.user,
        hasAccessToken: !!backendResponse.data?.accessToken,
      });
      
      // Локальний бекенд повертає: { user, accessToken, refreshToken? }
      // Конвертуємо в формат, який очікує authStore
      const responseData = backendResponse.data;
      if (responseData && responseData.user && responseData.accessToken) {
        return {
          success: true,
          message: 'Login successful',
          data: {
            token: responseData.accessToken,
            refreshToken: responseData.refreshToken || responseData.accessToken, // Використовуємо refreshToken якщо є, інакше accessToken
            user: responseData.user,
          },
        };
      }
      
      return backendResponse.data;
    } catch (backendError: any) {
      console.warn('⚠️ Local backend login failed, trying admin panel:', backendError.message);
      
      // Fallback на адмін-панель
      // Адмін-панель повертає: { success: true, message: "...", data: { token: "...", user: {...} } }
      const response = await apiClient.post('/auth/login', data);
      return response.data; // Повертаємо весь response.data
    }
  },

  // Sign up - General
  signUpGeneral: async (data: SignUpGeneralDto): Promise<AuthResponse> => {
    console.log('📤 Sending sign up general request:', { ...data, password: '***' });
    
    // Спочатку пробуємо локальний бекенд (він повертає { user, accessToken })
    try {
      console.log('🔄 Trying local backend first...');
      const requestData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      };
      
      console.log('📤 Backend request data:', {
        ...requestData,
        password: '***',
        phoneLength: requestData.phone?.length,
        firstNameLength: requestData.firstName?.length,
        lastNameLength: requestData.lastName?.length,
      });
      
      const backendResponse = await backendApiClient.post('/auth/register', requestData);
      
      console.log('✅ Local backend response:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        hasData: !!backendResponse.data,
        dataType: typeof backendResponse.data,
        dataKeys: backendResponse.data ? Object.keys(backendResponse.data) : [],
        fullResponseData: JSON.stringify(backendResponse.data, null, 2),
        hasUser: !!backendResponse.data?.user,
        hasAccessToken: !!backendResponse.data?.accessToken,
        accessTokenType: typeof backendResponse.data?.accessToken,
        userType: typeof backendResponse.data?.user,
      });
      
      // Локальний бекенд повертає: { user, accessToken }
      // Axios автоматично обгортає в response.data
      const responseData = backendResponse.data;
      
      console.log('🔍 Extracted response data:', {
        hasResponseData: !!responseData,
        responseDataType: typeof responseData,
        responseDataKeys: responseData ? Object.keys(responseData) : [],
        hasUser: !!responseData?.user,
        hasAccessToken: !!responseData?.accessToken,
        hasData: !!responseData?.data,
        hasDataUser: !!responseData?.data?.user,
        hasDataAccessToken: !!responseData?.data?.accessToken,
        fullResponseData: JSON.stringify(responseData, null, 2),
      });
      
      // Перевіряємо, чи дані вже в правильному форматі
      if (responseData && (responseData.user || responseData.accessToken)) {
        console.log('✅ Response data is in correct format');
        return responseData;
      }
      
      // Якщо дані обгорнуті в інший формат, намагаємося їх витягнути
      if (responseData?.data && (responseData.data.user || responseData.data.accessToken)) {
        console.log('✅ Extracting data from nested structure');
        return responseData.data;
      }
      
      console.warn('⚠️ Response data format unexpected');
      return responseData;
    } catch (backendError: any) {
      console.warn('⚠️ Local backend failed, trying admin panel:', backendError.message);
      
      // Fallback на адмін-панель
      const response = await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      });
      
      console.log('📥 Admin panel response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });
      
      return response.data;
    }
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
    console.log('📤 Sending sign up agent request:', { ...data, password: '***' });
    
    const licenseNumber = data.licenseNumber || `BROKER-${Date.now()}`;
    
    // Спочатку пробуємо локальний бекенд (він повертає { user, accessToken })
    try {
      console.log('🔄 Trying local backend first...');
      const backendResponse = await backendApiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: UserRole.BROKER,
        licenseNumber: licenseNumber,
      });
      
      console.log('✅ Local backend response:', {
        status: backendResponse.status,
        hasData: !!backendResponse.data,
        dataKeys: backendResponse.data ? Object.keys(backendResponse.data) : [],
      });
      
      // Локальний бекенд повертає: { user, accessToken }
      return backendResponse.data;
    } catch (backendError: any) {
      console.warn('⚠️ Local backend failed, trying admin panel:', backendError.message);
      
      // Fallback на адмін-панель
      const response = await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: UserRole.BROKER,
        licenseNumber: licenseNumber,
      });
      
      console.log('📥 Admin panel response:', {
        status: response.status,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });
      
      return response.data;
    }
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

