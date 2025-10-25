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
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  signUpGeneral: async (data: SignUpGeneralDto) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await authApi.signUpGeneral(data);
      
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
      
      const response = await authApi.signUpAgent(data);
      
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

