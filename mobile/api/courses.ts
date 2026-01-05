import { publicApiClient } from './public-api-client';
import { apiClient } from './client';

// Типи для Courses API
export interface CourseContent {
  id?: string;
  courseId?: string;
  type: 'text' | 'image' | 'video';
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  order: number;
}

export interface CourseLink {
  id?: string;
  courseId?: string;
  title: string;
  url: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  order: number;
  contents?: CourseContent[];
  links?: CourseLink[];
  createdAt?: string;
  updatedAt?: string;
  userProgress?: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    completionPercentage: number;
    lastAccessedAt?: string;
  };
}

export interface CoursesListResponse {
  success: boolean;
  data: Course[];
}

export interface CourseResponse {
  success: boolean;
  data: Course | null;
}

export const coursesApi = {
  /**
   * Отримати список всіх курсів (Public API)
   */
  async getAll(): Promise<CoursesListResponse> {
    console.log('📚 Fetching all courses (Public API)...');

    try {
      const response = await publicApiClient.get<CoursesListResponse>('/public/courses');

      console.log('✅ Courses response:', {
        status: response.status,
        success: response.data?.success,
        coursesCount: Array.isArray(response.data?.data) ? response.data.data.length : 0,
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        // Сортуємо курси за order ASC
        const sortedCourses = [...response.data.data].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Сортуємо contents та links для кожного курсу
        const normalizedCourses = sortedCourses.map(course => ({
          ...course,
          contents: course.contents
            ? [...course.contents].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
          links: course.links
            ? [...course.links].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
        }));

        return {
          success: true,
          data: normalizedCourses,
        };
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Отримати один курс за ID (Public API)
   */
  async getById(id: string): Promise<CourseResponse> {
    console.log('📚 Fetching course by ID:', id);

    try {
      const response = await publicApiClient.get<CourseResponse>(`/public/courses/${id}`);

      console.log('✅ Course detail response:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
      });

      if (response.data.success && response.data.data) {
        // Сортуємо contents та links
        const normalizedCourse = {
          ...response.data.data,
          contents: response.data.data.contents
            ? [...response.data.data.contents].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
          links: response.data.data.links
            ? [...response.data.data.links].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
        };

        return {
          success: true,
          data: normalizedCourse,
        };
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching course detail:', error);
      throw error;
    }
  },

  /**
   * Отримати всі курси (Admin API - для авторизованих користувачів)
   */
  async getAllAdmin(): Promise<CoursesListResponse> {
    console.log('📚 Fetching all courses (Admin API)...');

    try {
      const response = await apiClient.get<{ success: boolean; data: Course[] }>('/courses');

      console.log('✅ All courses response:', {
        status: response.status,
        success: response.data?.success,
        coursesCount: Array.isArray(response.data?.data) ? response.data.data.length : 0,
      });

      if (response.data.success && Array.isArray(response.data.data)) {
        // Сортуємо курси за order ASC
        const sortedCourses = [...response.data.data].sort((a, b) => (a.order || 0) - (b.order || 0));

        // Сортуємо contents та links для кожного курсу
        const normalizedCourses = sortedCourses.map(course => ({
          ...course,
          contents: course.contents
            ? [...course.contents].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
          links: course.links
            ? [...course.links].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
        }));

        return {
          success: true,
          data: normalizedCourses,
        };
      }

      // Fallback формат
      return {
        success: true,
        data: [],
      };
    } catch (error: any) {
      console.error('❌ Error fetching all courses:', error);
      throw error;
    }
  },

  /**
   * Отримати один курс за ID (Admin API)
   */
  async getByIdAdmin(id: string): Promise<CourseResponse> {
    console.log('📚 Fetching course by ID (Admin API):', id);

    try {
      const response = await apiClient.get<CourseResponse>(`/courses/${id}`);

      if (response.data.success && response.data.data) {
        // Сортуємо contents та links
        const normalizedCourse = {
          ...response.data.data,
          contents: response.data.data.contents
            ? [...response.data.data.contents].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
          links: response.data.data.links
            ? [...response.data.data.links].sort((a, b) => (a.order || 0) - (b.order || 0))
            : [],
        };

        return {
          success: true,
          data: normalizedCourse,
        };
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Error fetching course by ID (Admin API):', error);
      throw error;
    }
  },

  /**
   * Оновити прогрес курсу для поточного користувача
   */
  async updateProgress(id: string, status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'): Promise<{ success: boolean }> {
    console.log(`📚 Updating course ${id} progress to:`, status);
    try {
      // Використовуємо шлях без версії v1, оскільки бекенд реалізував його як /api/courses/...
      // Ми використовуємо baseURL, який закінчується на /v1, тому піднімаємося на рівень вище
      const response = await apiClient.post(`/../courses/${id}/progress`, { status });
      return { success: response.status === 200 || response.status === 201 };
    } catch (error) {
      console.error('❌ Error updating progress:', error);
      throw error;
    }
  },
};
