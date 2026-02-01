import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, Animated, PanResponder, ActivityIndicator, Alert, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header, CollectionPropertyCard } from '@/components/ui';
// import AddPropertyToCollectionModal from '@/components/ui/AddPropertyToCollectionModal'; // Removed
import { useTheme } from '@/utils/theme';
import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useCollectionsStore } from '@/store/collectionsStore';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/api/properties';
import { convertPropertyToCard, formatPrice } from '@/utils/property-utils';
import { useFavoritesStore } from '@/store/favoritesStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showDescription, setShowDescription] = useState(false);

  // Завантажуємо колекцію з store (реактивно)
  const collections = useCollectionsStore((state) => state.collections);
  const { removePropertyFromCollection, addPropertyToCollection, clearCollectionProperties, updateCollectionImage } = useCollectionsStore();

  const collection = useMemo(() => {
    const collectionId = typeof id === 'string' ? id : id?.[0];
    if (!collectionId) return undefined;

    // Шукаємо колекцію в актуальному списку (реактивно оновлюється)
    const foundCollection = collections.find(c => c.id === collectionId);
    console.log('🔍 Looking for collection:', {
      collectionId,
      totalCollections: collections.length,
      found: !!foundCollection,
      propertyIds: foundCollection?.propertyIds.length || 0,
    });
    return foundCollection;
  }, [id, collections]);

  // Завантажуємо properties з API (реактивно оновлюється з collection)
  const propertyIds = useMemo(() => {
    const ids = collection?.propertyIds || [];
    console.log('📋 Current propertyIds for collection:', {
      collectionId: collection?.id,
      propertyIds: ids,
      count: ids.length,
    });
    return ids;
  }, [collection?.propertyIds, collection?.id]);

  // Створюємо унікальний ключ для query на основі propertyIds
  const propertyIdsKey = useMemo(() => {
    // Копіюємо масив перед сортуванням, щоб не мутувати оригінал
    const key = [...propertyIds].sort().join(',');
    console.log('🔑 PropertyIds key for query:', key);
    return key;
  }, [propertyIds]);

  const { data: propertiesData, isLoading, error, refetch } = useQuery({
    queryKey: ['collection-properties', collection?.id, propertyIdsKey],
    queryFn: async () => {
      // Отримуємо актуальні ID з масиву (копіюємо для безпеки)
      const idsToFetch = [...propertyIds].filter(id => !!id);

      if (idsToFetch.length === 0) {
        console.log('ℹ️ No properties to fetch for collection');
        return [];
      }

      console.log('🔄 Fetching properties for collection:', {
        collectionId: collection?.id,
        count: idsToFetch.length,
        ids: idsToFetch,
      });

      // Завантажуємо кожен property за ID паралельно
      const propertiesPromises = idsToFetch.map(async (propertyId) => {
        try {
          const result = await propertiesApi.getById(propertyId);
          if (result && result.success && result.data) {
            return result.data;
          }
          console.warn(`⚠️ Property ${propertyId} returned unsuccessful response:`, result);
          return null;
        } catch (err) {
          console.error(`❌ Failed to fetch property ${propertyId}:`, err);
          return null;
        }
      });

      const results = await Promise.all(propertiesPromises);
      const properties = results.filter((prop): prop is any => prop !== null && !!prop.id);

      console.log('✅ Successfully loaded properties:', {
        wanted: idsToFetch.length,
        loaded: properties.length,
      });

      // Конвертуємо в формат для UI
      // Note: We don't pass favoriteIds here because we don't need real-time favorite updates 
      // during the fetch query cached result. We will re-map in the UI if needed
      // or we can just pass updated favoriteIds if we want strict consistency.
      // However, since useQuery caches the result, let's keep it pure data 
      // and handle favorite status application in rendering or useMemo if possible.
      // But property-utils is now expecting favoriteIds for isFavorite.
      // So let's pass an empty array here for the cache to be "clean property data"
      // and we will handle favorite status application in the UI rendering.
      // WAIT, actually property-utils returns PropertyCardData which includes isFavorite.
      // If we bake false into it, it will be false. 
      // The best way is to pass current favoriteIds here.
      // Since react-query keys include only IDs, but favoriteIds change often.
      // We should probably NOT bake favoriteIds into the cached query data
      // OR we should accept that this query will return properties with potentially stale favorite status
      // unless we invalidate it often.
      // BETTER APPROACH: Let's convert in the render or a separate useMemo that depends on favoriteIds.
      // But the query returns already converted data: `return properties.map(prop => convertPropertyToCard(prop));`
      // Let's change the query to return RAW properties, and convert them in useMemo.
      return properties;
    },
    enabled: !!collection && propertyIds.length >= 0, // Завжди enabled якщо є колекція
    staleTime: 1000 * 60, // 1 хвилина
  });

  // Favorites store
  const { favoriteIds } = useFavoritesStore();

  const formattedProperties = useMemo(() => {
    if (!propertiesData) return [];
    return propertiesData.map((prop: any) => convertPropertyToCard(prop, favoriteIds));
  }, [propertiesData, favoriteIds]);

  // Оновлюємо image колекції, коли завантажуються properties
  useEffect(() => {
    if (!collection?.id) return;

    // Якщо завантажились properties і у колекції немає картинки - встановлюємо першу
    if (formattedProperties && formattedProperties.length > 0 && !collection.image) {
      const firstImage = formattedProperties[0].images && formattedProperties[0].images.length > 0
        ? formattedProperties[0].images[0]
        : null;

      if (firstImage) {
        console.log('🖼️ Auto-updating collection image to:', firstImage);
        updateCollectionImage(collection.id, firstImage);
      }
    }
  }, [collection?.id, collection?.image, propertiesData, updateCollectionImage]);

  // Форматування дати
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }, []);

  const createdDate = collection?.createdAt ? formatDate(collection.createdAt) : '';

  const deleteProperty = useCallback((propertyId: string) => {
    if (collection?.id) {
      removePropertyFromCollection(collection.id, propertyId);
    }
  }, [collection?.id, removePropertyFromCollection]);



  // Обробка очищення колекції (видалення всіх елементів)
  const handleClearCollection = useCallback(() => {
    if (!collection?.id) return;

    Alert.alert(
      'Clear Properties?',
      'Are you sure you want to remove all properties from this collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearCollectionProperties(collection.id);
          },
        },
      ]
    );
  }, [collection?.id, clearCollectionProperties]);

  // Видалення всієї колекції
  const handleDeleteCollection = useCallback(() => {
    if (!collection?.id) return;

    Alert.alert(
      'Delete Collection?',
      'Are you sure you want to delete this collection PERMANENTLY? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { deleteCollection } = useCollectionsStore.getState();
            await deleteCollection(collection.id);
            router.replace('/(tabs)/collections');
          },
        },
      ]
    );
  }, [collection?.id, router]);

  const handleLongPressProperty = useCallback((propertyId: string) => {
    Alert.alert(
      'Remove from collection?',
      'Are you sure you want to remove this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => deleteProperty(propertyId)
        }
      ]
    );
  }, [deleteProperty]);

  const renderPropertyItem = ({ item }: { item: ReturnType<typeof convertPropertyToCard> }) => {
    // Форматуємо дані для картки з валідацією URI
    const getValidImageUri = (images: string[] | undefined): string => {
      if (!images || images.length === 0) {
        return 'https://via.placeholder.com/400x300?text=No+Image';
      }
      const firstImage = images[0];
      if (!firstImage || typeof firstImage !== 'string' || firstImage.trim().length === 0) {
        return 'https://via.placeholder.com/400x300?text=No+Image';
      }
      // Перевіряємо, чи це валідний URI
      if (firstImage.startsWith('http://') || firstImage.startsWith('https://') || firstImage.startsWith('data:') || firstImage.startsWith('file://')) {
        return firstImage;
      }
      return 'https://via.placeholder.com/400x300?text=No+Image';
    };

    const image = getValidImageUri(item.images);
    const title = item.title;
    const description = item.location;
    const price = formatPrice(item.price, 'USD');
    const handoverDate = item.handoverDate || (item.type === 'off-plan' ? 'TBA' : 'N/A');

    return (
      <CollectionPropertyCard
        image={image}
        title={title}
        description={description}
        price={price}
        handoverDate={handoverDate}
        onPress={() => router.push(`/property/${item.id}?fromCollection=${collection?.id}`)}
        onLongPress={() => handleLongPressProperty(item.id)}
      />
    );
  };

  const stats = useMemo(() => {
    if (!propertiesData || propertiesData.length === 0) return { totalValue: 0, avgPrice: 0, totalRooms: 0 };
    const total = propertiesData.reduce((sum: number, p: any) => sum + (Number(p.price) || 0), 0);
    const rooms = propertiesData.reduce((sum: number, p: any) => sum + (Number(p.bedrooms) || 0), 0);
    return {
      totalValue: total,
      avgPrice: total / propertiesData.length,
      totalRooms: rooms
    };
  }, [propertiesData]);

  const ListHeaderComponent = () => (
    <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          {collection?.title || 'Loading...'}
        </Text>
        {collection?.description ? (
          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            {collection.description}
          </Text>
        ) : null}
      </View>

      <View style={[styles.separator, { backgroundColor: theme.border }]} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatPrice(stats.totalValue, 'USD')}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Total Value
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {formatPrice(stats.avgPrice, 'USD')}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Avg Price
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {stats.totalRooms}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Rooms
          </Text>
        </View>
      </View>
    </View>
  );

  // Показуємо помилку, якщо колекція не знайдена
  if (!collection && !isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Collection</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Collection not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Collection</Text>

        <View style={styles.backButton} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading properties...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Error loading properties
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            {(error as any)?.message || 'Unknown error'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={formattedProperties}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="home-outline" size={64} color={theme.textTertiary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No properties in this collection
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Add properties to see them here
              </Text>
            </View>
          }
        />
      )}

      {/* Bottom Action Buttons Island (Restored Premium Style) */}
      <View style={[styles.footerContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20 }]}>
        <View style={[
          styles.footerBackground,
          {
            backgroundColor: isDark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
          }
        ]}>
          <BlurView
            intensity={100}
            tint={isDark ? 'dark' : 'light'}
            style={styles.footer}
          >
            {propertyIds.length > 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  {
                    backgroundColor: 'transparent',
                    borderColor: theme.border,
                    width: 48,
                    paddingHorizontal: 0,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                onPress={handleClearCollection}
              >
                <Ionicons name="close-outline" size={22} color={theme.text} />
              </Pressable>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: theme.primary,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                }
              ]}
              onPress={() => router.push({
                pathname: '/collections/add-property',
                params: { collectionId: collection?.id }
              })}
            >
              <Text style={styles.submitButtonText}>Add to collection</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  backgroundColor: 'transparent',
                  borderColor: theme.border,
                  width: 48,
                  paddingHorizontal: 0,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  opacity: pressed ? 0.7 : 1,
                }
              ]}
              onPress={handleDeleteCollection}
            >
              <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </Pressable>
          </BlurView>
        </View>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 150, // Increased to avoid overlap with floating footer
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },


  swipeableContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    zIndex: 1,
  },
  deleteButtonInner: {
    width: 64,
    height: '100%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },

  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    zIndex: 10,
  },
  footerBackground: {
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cancelButton: {
    height: '100%',
    aspectRatio: 1, // Icon button
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  submitButton: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
