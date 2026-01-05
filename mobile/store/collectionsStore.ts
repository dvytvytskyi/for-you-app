import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { collectionsApi, Collection as ApiCollection } from '@/api/collections';

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string | null;
  propertyIds: string[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CollectionsState {
  collections: Collection[];
  isLoading: boolean;
  error: string | null;

  // Getters
  getCollection: (id: string) => Collection | undefined;
  getCollections: () => Collection[];

  // Actions
  fetchCollections: () => Promise<void>;
  createCollection: (title: string, description: string) => Promise<Collection>;
  updateCollection: (id: string, title?: string, description?: string) => Promise<void>;
  updateCollectionImage: (id: string, image: string | null) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;

  // Property management
  addPropertyToCollection: (collectionId: string, propertyId: string, propertyImage?: string | null) => Promise<void>;
  removePropertyFromCollection: (collectionId: string, propertyId: string) => Promise<void>;
  isPropertyInCollection: (collectionId: string, propertyId: string) => boolean;
  getCollectionPropertyIds: (collectionId: string) => string[];
  clearCollectionProperties: (collectionId: string) => Promise<void>;
  clearAllCollections: () => void;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      collections: [],
      isLoading: false,
      error: null,

      getCollection: (id: string) => {
        return get().collections.find(c => c.id === id);
      },

      getCollections: () => {
        return get().collections;
      },

      fetchCollections: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = await SecureStore.getItemAsync('accessToken');
          if (!token) {
            // If not authenticated, we just keep local collections (if any) or do nothing
            set({ isLoading: false });
            return;
          }

          const serverCollections = await collectionsApi.getAll();

          if (!serverCollections || !Array.isArray(serverCollections)) {
            console.warn('⚠️ Server returned non-array collections:', serverCollections);
            set({ isLoading: false });
            return;
          }

          // Map server collections to store format with fallback for common field name variations
          const mappedCollections: Collection[] = serverCollections.map((c: any) => ({
            id: c.id,
            title: c.title || c.name || 'Untitled',
            description: c.description || '',
            // Try to find an image from properties if collection image is missing
            image: c.image || (Array.isArray(c.properties) && c.properties.length > 0 && typeof c.properties[0] === 'object' && c.properties[0].images && c.properties[0].images[0]
              ? c.properties[0].images[0]
              : null),
            propertyIds: Array.isArray(c.properties)
              ? c.properties.map((p: any) => {
                if (typeof p === 'string') return p;
                return p.propertyId || p.property_id || p.id;
              }).filter((id: any) => !!id)
              : (c.propertyIds || c.propertyId || []),
            userId: c.userId,
            createdAt: c.createdAt || c.created_at || new Date().toISOString(),
            updatedAt: c.updatedAt || c.updated_at || new Date().toISOString(),
          }));

          set({ collections: mappedCollections, isLoading: false });
          console.log('✅ Collections synced from server:', mappedCollections.length);
        } catch (error: any) {
          console.error('Failed to fetch collections:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      createCollection: async (title: string, description: string) => {
        set({ isLoading: true, error: null });
        try {
          const token = await SecureStore.getItemAsync('accessToken');

          if (token) {
            const result = await collectionsApi.create({ title, description });
            // Handle both wrapped and unwrapped response
            const newCollection = result?.data || result;

            const mappedCollection: Collection = {
              id: newCollection.id,
              title: newCollection.title || newCollection.name || title,
              description: newCollection.description || description || '',
              image: newCollection.image || null,
              propertyIds: [],
              userId: newCollection.userId,
              createdAt: newCollection.createdAt || newCollection.created_at || new Date().toISOString(),
              updatedAt: newCollection.updatedAt || newCollection.updated_at || new Date().toISOString(),
            };

            set(state => ({
              collections: [mappedCollection, ...state.collections],
              isLoading: false
            }));
            return mappedCollection;
          } else {
            // Local only
            const now = new Date().toISOString();
            const newCollection: Collection = {
              id: `local-${Date.now()}`,
              title: title.trim(),
              description: description.trim(),
              image: null,
              propertyIds: [],
              createdAt: now,
              updatedAt: now,
            };

            set(state => ({
              collections: [newCollection, ...state.collections],
              isLoading: false
            }));
            return newCollection;
          }
        } catch (error: any) {
          console.error('Failed to create collection:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateCollection: async (id: string, title?: string, description?: string) => {
        // Optimistic update
        set(state => ({
          collections: state.collections.map(c =>
            c.id === id ? { ...c, title: title ?? c.title, description: description ?? c.description } : c
          )
        }));

        const token = await SecureStore.getItemAsync('accessToken');
        if (token && !id.startsWith('local-')) {
          try {
            await collectionsApi.update(id, { title, description });
          } catch (error) {
            console.error('Failed to sync update collection:', error);
          }
        }
      },

      updateCollectionImage: async (id: string, image: string | null) => {
        // Optimistic update
        set(state => ({
          collections: state.collections.map(c =>
            c.id === id ? { ...c, image: image } : c
          )
        }));

        const token = await SecureStore.getItemAsync('accessToken');
        if (token && !id.startsWith('local-')) {
          try {
            await collectionsApi.update(id, { image: image || undefined });
          } catch (error: any) {
            // Використовуємо warn для фонових помилок, щоб не блокувати UI
            console.warn(`⚠️ Failed to sync update collection image (ID: ${id}):`, error.message);
            if (error.response?.status === 404) {
              console.warn('ℹ️ Collection might not exist on server yet or endpoint is incorrect');
            }
          }
        }
      },

      deleteCollection: async (id: string) => {
        set(state => ({
          collections: state.collections.filter(c => c.id !== id)
        }));

        const token = await SecureStore.getItemAsync('accessToken');
        if (token && !id.startsWith('local-')) {
          try {
            await collectionsApi.delete(id);
          } catch (error) {
            console.error('Failed to sync delete collection:', error);
          }
        }
      },

      addPropertyToCollection: async (collectionId: string, propertyId: string, propertyImage?: string | null) => {
        // Optimistic update
        set(state => {
          const collection = state.collections.find(c => c.id === collectionId);
          if (!collection) return state;
          if (collection.propertyIds.includes(propertyId)) return state;

          const newPropertyIds = [...collection.propertyIds, propertyId];
          const newImage = (collection.propertyIds.length === 0 && propertyImage) ? propertyImage : collection.image;

          return {
            collections: state.collections.map(c =>
              c.id === collectionId ? { ...c, propertyIds: newPropertyIds, image: newImage } : c
            )
          };
        });

        const token = await SecureStore.getItemAsync('accessToken');
        if (token && !collectionId.startsWith('local-')) {
          try {
            // Get the updated collection to send the full list of properties
            const updatedCollection = get().getCollection(collectionId);
            if (updatedCollection) {
              console.log(`🔄 Syncing add property ${propertyId} to collection ${collectionId} via PATCH`);
              await collectionsApi.updateProperties(collectionId, updatedCollection.propertyIds);

              // If we updated the image locally, try to persist it to the server
              if (updatedCollection.image && updatedCollection.image === propertyImage) {
                console.log('🖼️ Syncing collection cover image to backend:', propertyImage);
                collectionsApi.update(collectionId, { image: propertyImage }).catch(err => {
                  console.warn('⚠️ Failed to auto-update collection cover image:', err.message);
                });
              }
            }
          } catch (error: any) {
            console.error('❌ Failed to sync add property:', error.message);
            // Rollback optimistic update if server request failed
            set(state => {
              const collection = state.collections.find(c => c.id === collectionId);
              if (!collection) return state;
              return {
                collections: state.collections.map(c =>
                  c.id === collectionId ? { ...c, propertyIds: c.propertyIds.filter(id => id !== propertyId) } : c
                )
              }
            });
            // Re-throw or notify user could be added here
          }
        }
      },

      removePropertyFromCollection: async (collectionId: string, propertyId: string) => {
        set(state => {
          const collection = state.collections.find(c => c.id === collectionId);
          if (!collection) return state;

          const newPropertyIds = collection.propertyIds.filter(id => id !== propertyId);
          // We don't verify if newImage is correct aggressively without server response, keeping usage simple
          // But if image was the one removed... logic gets complex. 
          // For now, simplify to just successful removal.

          return {
            collections: state.collections.map(c =>
              c.id === collectionId ? { ...c, propertyIds: newPropertyIds } : c
            )
          };
        });

        const token = await SecureStore.getItemAsync('accessToken');
        if (token && !collectionId.startsWith('local-')) {
          try {
            const updatedCollection = get().getCollection(collectionId);
            if (updatedCollection) {
              console.log(`🔄 Syncing remove property ${propertyId} from collection ${collectionId} via PATCH`);
              await collectionsApi.updateProperties(collectionId, updatedCollection.propertyIds);
            }
          } catch (error) {
            console.error('Failed to sync remove property:', error);
            // Ideally we should rollback here too, but for simplicity/time:
            // Just logging error.
          }
        }
      },

      isPropertyInCollection: (collectionId: string, propertyId: string) => {
        const collection = get().getCollection(collectionId);
        return collection ? collection.propertyIds.includes(propertyId) : false;
      },

      getCollectionPropertyIds: (collectionId: string) => {
        const collection = get().getCollection(collectionId);
        return collection ? collection.propertyIds : [];
      },

      clearCollectionProperties: async (collectionId: string) => {
        set(state => ({
          collections: state.collections.map(c => c.id === collectionId ? { ...c, propertyIds: [], image: null } : c)
        }));
      },

      clearAllCollections: () => set({ collections: [] }),


    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Auto fetch if token exists
          SecureStore.getItemAsync('accessToken').then(token => {
            if (token) state.fetchCollections();
          });
        }
      }
    }
  )
);
