import { backendApiClient } from './backend-client';
import { Property } from './properties';

// Типи відповідей від бекенду
export interface FavoritesListResponse {
  success: boolean;
  data: Property[];
}

export interface FavoriteIdsResponse {
  success: boolean;
  data: {
    favoriteIds: string[];
  };
}

export interface FavoriteStatusResponse {
  success: boolean;
  data: {
    isFavorite: boolean;
    propertyId: string;
  };
}

export interface AddFavoriteResponse {
  success: boolean;
  data: {
    message: string;
    propertyId: string;
  };
}

export interface RemoveFavoriteResponse {
  success: boolean;
  data: {
    message: string;
    propertyId: string;
  };
}

export const favoritesApi = {
  /**
   * Отримати всі улюблені properties користувача
   */
  async getAll(): Promise<FavoritesListResponse> {
    const response = await backendApiClient.get<FavoritesListResponse>('/favorites');

    if (!response.data.success) {
      throw new Error('Failed to fetch favorites');
    }

    return response.data;
  },

  /**
   * Отримати тільки ID улюблених properties (для швидкої синхронізації)
   */
  async getIds(): Promise<FavoriteIdsResponse> {
    const response = await backendApiClient.get<FavoriteIdsResponse>('/favorites/ids');

    if (!response.data.success) {
      throw new Error('Failed to fetch favorite IDs');
    }

    return response.data;
  },

  /**
   * Перевірити, чи property є в улюблених
   */
  async checkStatus(propertyId: string): Promise<FavoriteStatusResponse> {
    const response = await backendApiClient.get<FavoriteStatusResponse>(
      `/favorites/${propertyId}/status`
    );

    if (!response.data.success) {
      throw new Error('Failed to check favorite status');
    }

    return response.data;
  },

  /**
   * Додати property в улюблені
   */
  async add(propertyId: string): Promise<AddFavoriteResponse> {
    const response = await backendApiClient.post<AddFavoriteResponse>(
      `/favorites/${propertyId}`,
      {}
    );

    if (!response.data.success) {
      throw new Error('Failed to add to favorites');
    }

    return response.data;
  },

  /**
   * Видалити property з улюблених
   */
  async remove(propertyId: string): Promise<RemoveFavoriteResponse> {
    // Змінюємо на передачу propertyId в тілі запиту, як в колекціях
    // (адже ми не знаємо ID самого об'єкту Favorites, тільки ID властивості)
    const response = await backendApiClient.delete<RemoveFavoriteResponse>(
      `/favorites`,
      { data: { propertyId } }
    );

    if (!response.data.success) {
      throw new Error('Failed to remove from favorites');
    }

    return response.data;
  },
};























