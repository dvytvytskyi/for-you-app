import { publicApiClient } from './public-api-client';

// Типи для Developers API
export interface Developer {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  images: string[] | null;
  projectsCount: {
    total: number;
    offPlan: number;
    secondary: number;
  };
  createdAt: string;
}

export interface DevelopersResponse {
  success: boolean;
  data: Developer[];
}

export interface DeveloperResponse {
  success: boolean;
  data: Developer;
}

export const developersApi = {
  /**
   * Отримати список всіх девелоперів
   */
  async getAll(): Promise<DevelopersResponse> {
    console.log('🔄 Завантаження developers...');
    try {
      const response = await publicApiClient.get<DevelopersResponse>('/public/developers');
      const fullResponseStr = response.data
        ? JSON.stringify(response.data, null, 2).substring(0, 500)
        : 'null';

      console.log('✅ Developers API Response:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
        dataLength: response.data?.data?.length || 0,
        fullResponse: fullResponseStr,
      });
      return response.data;
    } catch (error: any) {
      console.warn('❌ Помилка завантаження developers:', error.message);
      console.warn('Error response details logged in interceptor');
      throw error;
    }
  },

  /**
   * Отримати одного девелопера за ID
   */
  async getById(id: string): Promise<DeveloperResponse> {
    console.log('🔄 Завантаження developer:', id);
    try {
      const response = await publicApiClient.get<DeveloperResponse>(`/public/developers/${id}`);
      console.log('✅ Developer завантажено:', response?.data?.data?.name || 'none');
      return response.data;
    } catch (error: any) {
      console.error('❌ Помилка завантаження developer:', error);
      throw error;
    }
  },
};
