import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { favoritesApi } from '@/api/favorites';

interface FavoritesState {
  favoriteIds: string[]; // Масив ID улюблених properties
  isSyncing: boolean; // Чи йде синхронізація з сервером
  lastSyncTime: number | null; // Час останньої синхронізації
  
  // Methods
  isFavorite: (id: string) => boolean;
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
  
  // Sync methods
  syncFromServer: () => Promise<void>;
  syncToServer: (ids: string[]) => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      isSyncing: false,
      lastSyncTime: null,

      // Перевірка, чи property є улюбленим
      isFavorite: (id: string) => {
        const idStr = String(id);
        return get().favoriteIds.some(favId => String(favId) === idStr);
      },

      // Додати до улюблених (з синхронізацією на сервер)
      addFavorite: async (id: string) => {
        const idStr = String(id);
        const currentIds = get().favoriteIds;
        const idExists = currentIds.some(favId => String(favId) === idStr);
        
        // Якщо вже є - виходимо
        if (idExists) {
          return;
        }

        // Оновлюємо локально
        const newIds = [...currentIds, idStr];
        set({ favoriteIds: newIds });

        // Синхронізуємо з сервером (якщо користувач авторизований)
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          try {
            await favoritesApi.add(idStr);
            console.log('✅ Favorite added to server:', idStr);
          } catch (error: any) {
            console.warn('⚠️ Failed to sync favorite to server:', error.message);
            // Не відкатуємо локальну зміну - вона синхронізується пізніше
          }
        }
      },

      // Видалити з улюблених (з синхронізацією на сервер)
      removeFavorite: async (id: string) => {
        const idStr = String(id);
        const newIds = get().favoriteIds.filter(favId => String(favId) !== idStr);
        
        // Оновлюємо локально
        set({ favoriteIds: newIds });

        // Синхронізуємо з сервером (якщо користувач авторизований)
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          try {
            await favoritesApi.remove(idStr);
            console.log('✅ Favorite removed from server:', idStr);
          } catch (error: any) {
            console.warn('⚠️ Failed to sync favorite removal to server:', error.message);
            // Не відкатуємо локальну зміну - вона синхронізується пізніше
          }
        }
      },

      // Перемкнути стан (додати/видалити)
      toggleFavorite: async (id: string) => {
        const idStr = String(id);
        const isFav = get().isFavorite(idStr);
        if (isFav) {
          await get().removeFavorite(idStr);
        } else {
          await get().addFavorite(idStr);
        }
      },

      // Очистити всі улюблені
      clearFavorites: async () => {
        const currentIds = [...get().favoriteIds];
        
        // Очищаємо локально
        set({ favoriteIds: [] });

        // Синхронізуємо з сервером (видаляємо всі)
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated && currentIds.length > 0) {
          try {
            // Видаляємо всі favorites з сервера
            await Promise.all(
              currentIds.map(id => 
                favoritesApi.remove(id).catch(err => {
                  console.warn(`⚠️ Failed to remove favorite ${id}:`, err.message);
                })
              )
            );
            console.log('✅ All favorites cleared from server');
          } catch (error: any) {
            console.warn('⚠️ Failed to sync favorites clear to server:', error.message);
          }
        }
      },

      // Синхронізувати з сервера (завантажити favorites з сервера)
      syncFromServer: async () => {
        const token = await SecureStore.getItemAsync('accessToken');
        
        if (!token) {
          console.log('ℹ️ User not authenticated, skipping favorites sync');
          return;
        }

        set({ isSyncing: true });
        
        try {
          console.log('🔄 Syncing favorites from server...');
          
          // Використовуємо швидкий endpoint для отримання тільки ID
          // Якщо endpoint не існує (404), пробуємо отримати повний список
          let response;
          try {
            response = await favoritesApi.getIds();
          } catch (idsError: any) {
            // Якщо endpoint /favorites/ids не існує (404), пробуємо повний список
            if (idsError.response?.status === 404) {
              console.log('ℹ️ /favorites/ids endpoint not found, trying full list...');
              const fullResponse = await favoritesApi.getAll();
              if (fullResponse.success && fullResponse.data?.favorites) {
                const favoriteIds = fullResponse.data.favorites.map((fav: any) => fav.propertyId || fav.id);
                set({ 
                  favoriteIds,
                  lastSyncTime: Date.now(),
                });
                console.log('✅ Synced favorites from server (full list):', favoriteIds.length);
                return;
              }
            }
            throw idsError;
          }
          
          if (response.success && response.data.favoriteIds) {
            set({ 
              favoriteIds: response.data.favoriteIds,
              lastSyncTime: Date.now(),
            });
            console.log('✅ Synced favorites from server:', response.data.favoriteIds.length);
          }
        } catch (error: any) {
          // Не критична помилка - просто логуємо і продовжуємо роботу
          console.warn('⚠️ Failed to sync favorites from server:', error.message || 'Unknown error');
          
          // Якщо помилка 401 - користувач не авторизований, очищаємо
          if (error.response?.status === 401) {
            console.log('ℹ️ User not authenticated, clearing favorites');
            set({ favoriteIds: [] });
          }
          // Інші помилки не критичні - залишаємо локальні дані
        } finally {
          set({ isSyncing: false });
        }
      },

      // Синхронізувати на сервер (відправити локальні favorites на сервер)
      syncToServer: async (ids: string[]) => {
        const token = await SecureStore.getItemAsync('accessToken');
        
        if (!token) {
          console.log('ℹ️ User not authenticated, skipping favorites sync to server');
          return;
        }

        set({ isSyncing: true });
        
        try {
          console.log('🔄 Syncing favorites to server...', ids.length);
          
          // Отримуємо поточні favorites з сервера
          // Якщо endpoint /favorites/ids не існує, використовуємо повний список
          let serverIds: string[] = [];
          try {
            const serverResponse = await favoritesApi.getIds();
            serverIds = serverResponse.success ? serverResponse.data.favoriteIds : [];
          } catch (idsError: any) {
            if (idsError.response?.status === 404) {
              // Endpoint не існує, отримуємо повний список
              const fullResponse = await favoritesApi.getAll();
              if (fullResponse.success && fullResponse.data?.favorites) {
                serverIds = fullResponse.data.favorites.map((fav: any) => fav.propertyId || fav.id);
              }
            } else {
              throw idsError;
            }
          }
          
          // Визначаємо, що потрібно додати та видалити
          const idsToAdd = ids.filter(id => !serverIds.includes(id));
          const idsToRemove = serverIds.filter(id => !ids.includes(id));
          
          // Виконуємо синхронізацію
          await Promise.all([
            ...idsToAdd.map(id => 
              favoritesApi.add(id).catch(err => {
                console.warn(`⚠️ Failed to add favorite ${id}:`, err.message);
              })
            ),
            ...idsToRemove.map(id => 
              favoritesApi.remove(id).catch(err => {
                console.warn(`⚠️ Failed to remove favorite ${id}:`, err.message);
              })
            ),
          ]);
          
          set({ lastSyncTime: Date.now() });
          console.log('✅ Synced favorites to server');
        } catch (error: any) {
          // Не критична помилка
          console.warn('⚠️ Failed to sync favorites to server:', error.message || 'Unknown error');
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Не зберігаємо isSyncing та lastSyncTime
      partialize: (state) => ({
        favoriteIds: state.favoriteIds,
      }),
    }
  )
);
