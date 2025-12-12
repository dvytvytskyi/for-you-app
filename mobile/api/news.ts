import { publicApiClient } from './public-api-client';
import { apiClient } from './client';

// Типи для News API
export interface NewsContent {
  id?: string;
  newsId?: string;
  type: 'text' | 'image' | 'video';
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  order: number;
}

export interface News {
  id: string;
  slug?: string;
  title: string;
  titleRu?: string | null;
  description: string;
  descriptionRu?: string | null;
  imageUrl?: string | null;
  image?: string | null; // Public API використовує 'image' замість 'imageUrl'
  isPublished?: boolean;
  publishedAt: string | null;
  contents?: NewsContent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsListResponse {
  success: boolean;
  data: {
    data: News[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NewsResponse {
  success: boolean;
  data: News | null;
}

export interface NewsFilters {
  page?: number;
  limit?: number;
}

export const newsApi = {
  /**
   * Отримати список опублікованих новин (Public API)
   */
  async getPublished(filters?: NewsFilters): Promise<NewsListResponse> {
    const params: Record<string, any> = {
      page: filters?.page || 1,
      limit: Math.min(filters?.limit || 20, 100), // Максимум 100
    };

    console.log('📰 Fetching published news:', params);
    
    try {
      const response = await publicApiClient.get<NewsListResponse>('/public/news', { params });
      
      console.log('✅ News response:', {
        status: response.status,
        success: response.data?.success,
        newsCount: response.data?.data?.data?.length || 0,
        total: response.data?.data?.total || 0,
      });
      
      if (response.data.success && response.data.data) {
        // Нормалізуємо imageUrl (Public API використовує 'image')
        const normalizedNews = response.data.data.data.map(news => ({
          ...news,
          imageUrl: news.image || news.imageUrl || null,
        }));
        
        return {
          success: true,
          data: {
            ...response.data.data,
            data: normalizedNews,
          },
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching news:', error);
      throw error;
    }
  },

  /**
   * Отримати одну новину за slug або ID (Public API)
   */
  async getBySlug(slug: string): Promise<NewsResponse> {
    console.log('📰 Fetching news by slug:', slug);
    
    try {
      const response = await publicApiClient.get<NewsResponse>(`/public/news/${slug}`);
      
      console.log('✅ News detail response:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
      });
      
      if (response.data.success && response.data.data) {
        // Нормалізуємо imageUrl
        const normalizedNews = {
          ...response.data.data,
          imageUrl: response.data.data.image || response.data.data.imageUrl || null,
        };
        
        return {
          success: true,
          data: normalizedNews,
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching news detail:', error);
      throw error;
    }
  },

  /**
   * Отримати всі новини (Admin API - для авторизованих користувачів)
   */
  async getAll(): Promise<NewsListResponse> {
    console.log('📰 Fetching all news (Admin API)');
    
    try {
      const response = await apiClient.get<{ success: boolean; data: News[] }>('/news');
      
      console.log('✅ All news response:', {
        status: response.status,
        success: response.data?.success,
        newsCount: Array.isArray(response.data?.data) ? response.data.data.length : 0,
      });
      
      if (response.data.success && Array.isArray(response.data.data)) {
        // Конвертуємо масив в формат з пагінацією
        return {
          success: true,
          data: {
            data: response.data.data.map(news => ({
              ...news,
              imageUrl: news.imageUrl || news.image || null,
            })),
            total: response.data.data.length,
            page: 1,
            limit: response.data.data.length,
            totalPages: 1,
          },
        };
      }
      
      // Fallback формат
      return {
        success: true,
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0,
        },
      };
    } catch (error: any) {
      console.error('❌ Error fetching all news:', error);
      throw error;
    }
  },

  /**
   * Отримати одну новину за ID (Admin API)
   */
  async getById(id: string): Promise<NewsResponse> {
    console.log('📰 Fetching news by ID:', id);
    
    try {
      const response = await apiClient.get<NewsResponse>(`/news/${id}`);
      
      if (response.data.success && response.data.data) {
        const normalizedNews = {
          ...response.data.data,
          imageUrl: response.data.data.imageUrl || response.data.data.image || null,
        };
        
        return {
          success: true,
          data: normalizedNews,
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching news by ID:', error);
      throw error;
    }
  },
};
