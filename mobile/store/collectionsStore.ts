import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Collection {
  id: string;
  title: string;
  description: string;
  image: string | null; // URL до зображення (перше фото першого property)
  propertyIds: string[]; // Масив ID properties в колекції
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

interface CollectionsState {
  collections: Collection[];
  
  // Getters
  getCollection: (id: string) => Collection | undefined;
  getCollections: () => Collection[];
  
  // Actions
  createCollection: (title: string, description: string) => Collection;
  updateCollection: (id: string, title?: string, description?: string) => void;
  updateCollectionImage: (id: string, image: string | null) => void;
  deleteCollection: (id: string) => void;
  
  // Property management
  addPropertyToCollection: (collectionId: string, propertyId: string, propertyImage?: string | null) => void;
  removePropertyFromCollection: (collectionId: string, propertyId: string) => void;
  isPropertyInCollection: (collectionId: string, propertyId: string) => boolean;
  getCollectionPropertyIds: (collectionId: string) => string[];
  clearCollectionProperties: (collectionId: string) => void;
  clearAllCollections: () => void;
  clearMockCollections: () => void;
}

export const useCollectionsStore = create<CollectionsState>()(
  persist(
    (set, get) => ({
      collections: [],

      // Отримати колекцію за ID
      getCollection: (id: string) => {
        return get().collections.find(c => c.id === id);
      },

      // Отримати всі колекції
      getCollections: () => {
        return get().collections;
      },

      // Створити нову колекцію
      createCollection: (title: string, description: string) => {
        const now = new Date().toISOString();
        const newCollection: Collection = {
          id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: title.trim(),
          description: description.trim(),
          image: null,
          propertyIds: [],
          createdAt: now,
          updatedAt: now,
        };
        
        const currentCollections = get().collections;
        const updatedCollections = [newCollection, ...currentCollections];
        
        console.log('📦 Creating collection in store:', {
          newCollectionId: newCollection.id,
          currentCollectionsCount: currentCollections.length,
          updatedCollectionsCount: updatedCollections.length,
        });
        
        set({ 
          collections: updatedCollections
        });
        
        // Перевіряємо, чи колекція дійсно додалася
        const verifyCollections = get().collections;
        console.log('✅ Collection created, verifying:', {
          totalCollections: verifyCollections.length,
          foundNewCollection: verifyCollections.find(c => c.id === newCollection.id) !== undefined,
        });
        
        return newCollection;
      },

      // Оновити колекцію
      updateCollection: (id: string, title?: string, description?: string) => {
        set({
          collections: get().collections.map(c => {
            if (c.id === id) {
              return {
                ...c,
                title: title !== undefined ? title.trim() : c.title,
                description: description !== undefined ? description.trim() : c.description,
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        });
      },
      
      // Оновити зображення колекції
      updateCollectionImage: (id: string, image: string | null) => {
        const currentCollections = get().collections;
        const collection = currentCollections.find(c => c.id === id);
        
        if (!collection) {
          console.error('❌ Collection not found for image update:', id);
          return;
        }
        
        // Оновлюємо тільки якщо image змінився або колекція не має image
        if (collection.image === image) {
          return;
        }
        
        console.log('🖼️ Updating collection image:', {
          collectionId: id,
          oldImage: collection.image?.substring(0, 50) || 'null',
          newImage: image?.substring(0, 50) || 'null',
        });
        
        set({
          collections: currentCollections.map(c => {
            if (c.id === id) {
              return {
                ...c,
                image: image,
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        });
      },

      // Видалити колекцію
      deleteCollection: (id: string) => {
        set({
          collections: get().collections.filter(c => c.id !== id),
        });
      },

      // Додати property до колекції
      addPropertyToCollection: (collectionId: string, propertyId: string, propertyImage?: string | null) => {
        const currentCollections = get().collections;
        const collection = currentCollections.find(c => c.id === collectionId);
        
        if (!collection) {
          console.error('❌ Collection not found:', collectionId);
          return;
        }
        
        if (collection.propertyIds.includes(propertyId)) {
          console.log('ℹ️ Property already in collection:', propertyId);
          return;
        }
        
        console.log('➕ Adding property to collection:', {
          collectionId,
          propertyId,
          currentPropertyIds: collection.propertyIds.length,
          propertyImage: propertyImage?.substring(0, 50) || 'none',
        });
        
        // Якщо це перший property і є зображення - встановлюємо його як image колекції
        const isFirstProperty = collection.propertyIds.length === 0;
        const newImage = isFirstProperty && propertyImage 
          ? propertyImage 
          : (collection.image || null);
        
        const updatedCollections = currentCollections.map(c => {
          if (c.id === collectionId) {
            const updatedPropertyIds = [...c.propertyIds, propertyId];
            console.log('✅ Updated propertyIds:', {
              before: c.propertyIds.length,
              after: updatedPropertyIds.length,
              propertyIds: updatedPropertyIds,
              imageUpdated: isFirstProperty && !!propertyImage,
            });
            return {
              ...c,
              propertyIds: updatedPropertyIds,
              image: newImage,
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        });
        
        set({
          collections: updatedCollections
        });
        
        // Перевіряємо, чи property дійсно додалося
        const verifyCollection = get().collections.find(c => c.id === collectionId);
        console.log('✅ Property added, verifying:', {
          collectionId,
          propertyIdsCount: verifyCollection?.propertyIds.length || 0,
          hasProperty: verifyCollection?.propertyIds.includes(propertyId) || false,
          image: verifyCollection?.image || 'null',
        });
      },

      // Видалити property з колекції
      removePropertyFromCollection: (collectionId: string, propertyId: string) => {
        const currentCollections = get().collections;
        const collection = currentCollections.find(c => c.id === collectionId);
        
        if (!collection) {
          console.error('❌ Collection not found:', collectionId);
          return;
        }
        
        const updatedPropertyIds = collection.propertyIds.filter(id => id !== propertyId);
        
        // Якщо після видалення не залишилося properties - скидаємо image
        const newImage = updatedPropertyIds.length === 0 ? null : collection.image;
        
        set({
          collections: currentCollections.map(c => {
            if (c.id === collectionId) {
              return {
                ...c,
                propertyIds: updatedPropertyIds,
                image: newImage,
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        });
      },

      // Перевірити, чи property в колекції
      isPropertyInCollection: (collectionId: string, propertyId: string) => {
        const collection = get().getCollection(collectionId);
        return collection ? collection.propertyIds.includes(propertyId) : false;
      },

      // Отримати ID properties в колекції
      getCollectionPropertyIds: (collectionId: string) => {
        const collection = get().getCollection(collectionId);
        return collection ? collection.propertyIds : [];
      },

      // Очистити всі properties з колекції
      clearCollectionProperties: (collectionId: string) => {
        set({
          collections: get().collections.map(c => {
            if (c.id === collectionId) {
              return {
                ...c,
                propertyIds: [],
                image: null, // Скидаємо image при очищенні
                updatedAt: new Date().toISOString(),
              };
            }
            return c;
          }),
        });
      },
      
      // Очистити всі колекції (для тестування)
      clearAllCollections: () => {
        console.log('🗑️ Clearing all collections');
        set({
          collections: []
        });
      },
      
      // Очистити мокові/тестові колекції
      clearMockCollections: () => {
        const currentCollections = get().collections;
        const validCollections = currentCollections.filter(c => {
          // Видаляємо колекції з тестовими назвами
          const isTestCollection = 
            c.title.toLowerCase().includes('test') ||
            c.title.toLowerCase().includes('mock') ||
            c.title.toLowerCase().includes('example') ||
            c.title.toLowerCase().includes('sample') ||
            c.id.startsWith('test-') ||
            c.id.startsWith('mock-') ||
            c.id.startsWith('sample-');
          
          return !isTestCollection;
        });
        
        if (validCollections.length !== currentCollections.length) {
          console.log('🧹 Cleaning mock collections:', {
            before: currentCollections.length,
            after: validCollections.length,
            removed: currentCollections.length - validCollections.length,
          });
          set({
            collections: validCollections
          });
        }
      },
    }),
    {
      name: 'collections-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Очищаємо мокові колекції при завантаженні з AsyncStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          const currentCollections = state.collections || [];
          const validCollections = currentCollections.filter(c => {
            const isTestCollection = 
              c.title.toLowerCase().includes('test') ||
              c.title.toLowerCase().includes('mock') ||
              c.title.toLowerCase().includes('example') ||
              c.title.toLowerCase().includes('sample') ||
              c.id.startsWith('test-') ||
              c.id.startsWith('mock-') ||
              c.id.startsWith('sample-');
            
            return !isTestCollection;
          });
          
          if (validCollections.length !== currentCollections.length) {
            console.log('🧹 Auto-cleaning mock collections on load:', {
              before: currentCollections.length,
              after: validCollections.length,
            });
            state.collections = validCollections;
          }
        }
      },
    }
  )
);
