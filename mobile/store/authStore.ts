import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '@/types/user';
import { authApi, LoginDto, SignUpGeneralDto, SignUpInvestorDto, SignUpAgentDto } from '@/api/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginDto) => Promise<void>;
  signUpGeneral: (data: SignUpGeneralDto) => Promise<void>;
  signUpInvestor: (data: SignUpInvestorDto) => Promise<void>;
  signUpAgent: (data: SignUpAgentDto) => Promise<void>;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    avatar?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (data: LoginDto) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authApi.login(data);
      
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      
      // Локальний backend повертає: { success: true, message: "...", data: { token: "...", user: {...} } }
      // (вже конвертовано в authApi.login)
      // Адмін-панель також повертає: { success: true, message: "...", data: { token: "...", user: {...} } }
      
      let accessToken: string | undefined;
      let user: any;
      
      if (response.success && response.data) {
        // Формат адмін-панелі або конвертований формат локального backend
        // Формат: { success: true, data: { token, refreshToken, user } }
        accessToken = response.data.token || response.data.accessToken;
        user = response.data.user;
      } else if (response.user && response.accessToken) {
        // Прямий формат локального backend (якщо конвертація не спрацювала)
        accessToken = response.accessToken;
        user = response.user;
      } else {
        throw new Error(response.message || 'Invalid response format from server');
      }
      
      console.log('Extracted - Token present:', !!accessToken);
      console.log('Extracted - User:', user);
      
      if (!accessToken) {
        throw new Error('No token received from server');
      }
      
      if (!user) {
        throw new Error('No user data received from server');
      }
      
      // Перевірка статусу користувача
      if (user.status !== 'ACTIVE') {
        throw new Error(`Account status: ${user.status}. Please contact administrator.`);
      }
      
      // Extract refreshToken from response
      // Формат: { success: true, data: { token, refreshToken, user } }
      const refreshToken = response.data?.refreshToken || response.refreshToken;
      
      if (!refreshToken) {
        console.warn('⚠️ No refreshToken in response, using accessToken as fallback');
      }
      
      // Save tokens
      await SecureStore.setItemAsync('accessToken', accessToken);
      // Використовуємо refreshToken з відповіді, або fallback на accessToken якщо немає
      await SecureStore.setItemAsync('refreshToken', refreshToken || accessToken);
      
      console.log('✅ Tokens saved:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });
      
      // Зберігаємо користувача
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log('=== USER SET IN STORE ===');
      console.log('User role:', user.role);
      console.log('User status:', user.status);
      console.log('User ID:', user.id);
      console.log('Full user object:', JSON.stringify(user, null, 2));
      
      // Синхронізуємо favorites з сервера після успішного логіну
      try {
        const { useFavoritesStore } = await import('./favoritesStore');
        useFavoritesStore.getState().syncFromServer().catch(err => {
          console.warn('⚠️ Failed to sync favorites after login:', err);
        });
      } catch (error) {
        console.warn('⚠️ Failed to import favorites store:', error);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  signUpGeneral: async (data: SignUpGeneralDto) => {
    try {
      set({ isLoading: true, error: null });
      
      console.log('🔄 Sign up general with data:', { ...data, password: '***' });
      
      const response = await authApi.signUpGeneral(data);
      
      console.log('📥 Sign up response:', {
        hasResponse: !!response,
        responseType: typeof response,
        responseIsArray: Array.isArray(response),
        responseKeys: response ? Object.keys(response) : [],
        hasTokens: !!response.tokens,
        hasAccessToken: !!response.accessToken,
        hasData: !!response.data,
        hasDataToken: !!response.data?.token,
        hasUser: !!response.user,
        hasDataUser: !!response.data?.user,
        hasDataAccessToken: !!response.data?.accessToken,
        hasDataUserInData: !!response.data?.data?.user,
        userRole: response.user?.role || response.data?.user?.role || response.data?.data?.user?.role,
        accessTokenValue: response.accessToken ? (typeof response.accessToken === 'string' ? response.accessToken.substring(0, 20) + '...' : response.accessToken) : null,
        fullResponse: JSON.stringify(response, null, 2),
      });
      
      // Бекенд з TransformInterceptor повертає: { data: { user, accessToken }, statusCode, timestamp }
      // Без interceptor: { user: User, accessToken: string }
      // Адмін-панель може повертати: { success: true, data: { token, user } }
      // Перевіряємо всі варіанти
      let tokens: { accessToken: string; refreshToken: string };
      let user: any;
      
      // Спочатку перевіряємо, чи дані обгорнуті в response.data (TransformInterceptor)
      // TransformInterceptor обгортає в { data: T, statusCode, timestamp }
      let actualData = response;
      
      // Якщо є response.data і в ньому є user або accessToken, використовуємо response.data
      if (response.data && (response.data.user || response.data.accessToken)) {
        actualData = response.data;
      }
      // Якщо є response.data.data (подвійне обгортання)
      else if (response.data?.data && (response.data.data.user || response.data.data.accessToken)) {
        actualData = response.data.data;
      }
      
      if (actualData.tokens) {
        // Формат: { user, tokens: { accessToken, refreshToken } }
        tokens = actualData.tokens;
        user = actualData.user;
      } else if (actualData.data?.token) {
        // Формат адмін-панелі: { success: true, data: { token, refreshToken, user } }
        tokens = {
          accessToken: actualData.data.token,
          refreshToken: actualData.data.refreshToken || actualData.data.token,
        };
        user = actualData.data.user;
      } else if (actualData.accessToken) {
        // Формат бекенду: { user, accessToken, refreshToken? } (може бути обгорнутий в { data: { user, accessToken, refreshToken } })
        tokens = {
          accessToken: actualData.accessToken,
          refreshToken: actualData.refreshToken || actualData.accessToken,
        };
        user = actualData.user;
      } else {
        console.error('❌ Unknown response format. Full response:', response);
        console.error('❌ Actual data after extraction:', actualData);
        throw new Error('Invalid response format from server. Expected { user, accessToken } or { data: { user, accessToken } }');
      }
      
      if (!tokens.accessToken) {
        throw new Error('No access token received');
      }
      
      if (!user) {
        throw new Error('No user data received');
      }
      
      // Save tokens
      await SecureStore.setItemAsync('accessToken', tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
      
      console.log('✅ Tokens saved, user:', {
        id: user.id,
        email: user.email,
        role: user.role,
      });
      
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      try {
        console.error('❌ Sign up error:', error?.message || error);
        console.error('Error status:', error.response?.status);
        
        // Безпечне логування response data
        if (error.response?.data) {
          try {
            const errorData = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data, null, 2);
            console.error('Error response:', errorData);
          } catch (stringifyError) {
            console.error('Error response: [Unable to stringify]');
          }
        }
      } catch (loggingError) {
        console.error('❌ Error in error handler:', loggingError);
      }
      
      let errorMessage = 'Sign up failed';
      
      // Обробка різних типів помилок
      if (error.response?.status === 409) {
        // Conflict - користувач вже існує
        errorMessage = error.response?.data?.message || 'A user with this email or phone number already exists. Please use a different email or phone number.';
      } else if (error.response?.status === 400) {
        // Bad Request - невалідні дані
        errorMessage = error.response?.data?.message || 'Invalid data provided. Please check all fields and try again.';
      } else if (error.response?.status === 500) {
        // Internal Server Error
        errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  signUpInvestor: async (data: SignUpInvestorDto) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authApi.signUpInvestor(data);
      
      // Save tokens
      await SecureStore.setItemAsync('accessToken', response.tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', response.tokens.refreshToken);
      
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Sign up failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signUpAgent: async (data: SignUpAgentDto) => {
    try {
      set({ isLoading: true, error: null });
      
      console.log('🔄 Sign up agent with data:', { ...data, password: '***' });
      
      const response = await authApi.signUpAgent(data);
      
      console.log('📥 Sign up agent response:', {
        hasResponse: !!response,
        responseKeys: response ? Object.keys(response) : [],
        hasTokens: !!response.tokens,
        hasAccessToken: !!response.accessToken,
        hasData: !!response.data,
        hasDataToken: !!response.data?.token,
        hasUser: !!response.user,
        hasDataUser: !!response.data?.user,
        userRole: response.user?.role || response.data?.user?.role,
        fullResponse: JSON.stringify(response, null, 2),
      });
      
      // Бекенд повертає: { user: User, accessToken: string }
      // Адмін-панель може повертати: { success: true, data: { token, user } }
      // Перевіряємо обидва варіанти
      let tokens: { accessToken: string; refreshToken: string };
      let user: any;
      
      if (response.tokens) {
        // Формат: { user, tokens: { accessToken, refreshToken } }
        tokens = response.tokens;
        user = response.user;
      } else if (response.data?.token) {
        // Формат адмін-панелі: { success: true, data: { token, refreshToken, user } }
        tokens = {
          accessToken: response.data.token,
          refreshToken: response.data.refreshToken || response.data.token,
        };
        user = response.data.user;
      } else if (response.accessToken) {
        // Формат бекенду: { user, accessToken, refreshToken? }
        tokens = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || response.accessToken,
        };
        user = response.user;
      } else {
        console.error('❌ Unknown response format. Full response:', response);
        throw new Error('Invalid response format from server. Expected { user, accessToken } or { tokens, user }');
      }
      
      if (!tokens.accessToken) {
        throw new Error('No access token received');
      }
      
      if (!user) {
        throw new Error('No user data received');
      }
      
      // Save tokens
      await SecureStore.setItemAsync('accessToken', tokens.accessToken);
      await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
      
      console.log('✅ Tokens saved, user:', {
        id: user.id,
        email: user.email,
        role: user.role,
      });
      
      set({
        user: user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      try {
        console.error('❌ Sign up agent error:', error?.message || error);
        console.error('Error status:', error.response?.status);
        
        // Безпечне логування response data
        if (error.response?.data) {
          try {
            const errorData = typeof error.response.data === 'string'
              ? error.response.data
              : JSON.stringify(error.response.data, null, 2);
            console.error('Error response:', errorData);
          } catch (stringifyError) {
            console.error('Error response: [Unable to stringify]');
          }
        }
      } catch (loggingError) {
        console.error('❌ Error in error handler:', loggingError);
      }
      
      let errorMessage = 'Sign up failed';
      
      // Обробка різних типів помилок
      if (error.response?.status === 409) {
        // Conflict - користувач вже існує
        errorMessage = error.response?.data?.message || 'A user with this email or phone number already exists. Please use a different email or phone number.';
      } else if (error.response?.status === 400) {
        // Bad Request - невалідні дані
        errorMessage = error.response?.data?.message || 'Invalid data provided. Please check all fields and try again.';
      } else if (error.response?.status === 500) {
        // Internal Server Error
        errorMessage = error.response?.data?.message || 'Server error. Please try again later.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    avatar?: string;
  }) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedUser = await authApi.updateProfile(data);
      
      console.log('✅ Profile updated:', {
        userId: updatedUser.id,
        email: updatedUser.email,
      });
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('❌ Update profile error:', error);
      
      let errorMessage = 'Failed to update profile';
      
      if (error.response?.status === 409) {
        errorMessage = error.response?.data?.message || 'A user with this email or phone number already exists.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error);
    } finally {
      // Clear tokens
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      
      const token = await SecureStore.getItemAsync('accessToken');
      
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      
      const user = await authApi.getCurrentUser();
      
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // Token invalid or expired
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

