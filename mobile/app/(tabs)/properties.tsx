import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Image, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { SearchBar } from '@/components/ui';
import PropertyFiltersModal, { PropertyFilters } from '@/components/ui/PropertyFilters';
import { propertiesApi, Property } from '@/api/properties';
import { convertPropertyToCard, convertFiltersToAPI, formatPrice, PropertyCardData } from '@/utils/property-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavoritesStore } from '@/store/favoritesStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32; // padding left + right

export default function PropertiesScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    listingType: 'offplan',
    minPrice: null,
    maxPrice: null,
    propertyType: 'all',
    bedrooms: 'any',
    location: 'any',
  });
  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  // Конвертуємо UI фільтри в API фільтри
  const apiFilters = useMemo(() => {
    const baseFilters = convertFiltersToAPI(filters);
    return {
      ...baseFilters,
      search: debouncedSearch || undefined,
      page,
      limit: 20,
      sortBy: 'createdAt' as const,
      sortOrder: 'DESC' as const,
    };
  }, [filters, debouncedSearch, page]);

  // Завантаження properties з API
  const { data: propertiesResponse, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['properties', apiFilters],
    queryFn: async () => {
      console.log('🔄 Завантаження properties з API...', apiFilters);
      try {
        const response = await propertiesApi.getAll(apiFilters);
        console.log('✅ API Response received:', {
          success: response?.success,
          hasData: !!response?.data,
          hasProperties: !!response?.data?.data,
          propertiesCount: response?.data?.data?.length || 0,
          firstProperty: response?.data?.data?.[0]?.name || 'none',
        });
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження properties:', error);
        console.error('Error response:', error?.response?.data);
        console.error('Error status:', error?.response?.status);
        throw error;
      }
    },
    staleTime: 0, // Дані вважаються застарілими одразу
    cacheTime: 0, // Не кешуємо дані
    refetchOnMount: true, // Завжди завантажуємо при монтуванні
    refetchOnWindowFocus: false,
  });

  // Обробка даних
  const properties = useMemo(() => {
    console.log('📦 Обробка properties:', {
      hasResponse: !!propertiesResponse,
      hasData: !!propertiesResponse?.data,
      hasProperties: !!propertiesResponse?.data?.data,
      propertiesCount: propertiesResponse?.data?.data?.length || 0,
      page,
      allPropertiesCount: allProperties.length,
    });

    if (!propertiesResponse?.data?.data) {
      console.warn('⚠️ Немає даних для properties');
      return [];
    }
    
    const newPropertiesList = propertiesResponse.data.data;
    console.log('📋 Новий список properties:', newPropertiesList.length);
    console.log('📋 Перший property:', newPropertiesList[0]?.name || 'none');
    
    // Якщо перша сторінка - замінюємо весь список
    if (page === 1) {
      setAllProperties(newPropertiesList);
      return newPropertiesList;
    }
    
    // Якщо наступна сторінка - додаємо до існуючих
    const combinedProperties = [...allProperties, ...newPropertiesList];
    setAllProperties(combinedProperties);
    return combinedProperties;
  }, [propertiesResponse, page]);

  // Favorites store
  const { isFavorite: isFavoriteInStore, favoriteIds } = useFavoritesStore();
  
  // Конвертуємо properties для UI
  const cardProperties = useMemo(() => {
    console.log('🎨 Конвертація properties для UI:', properties.length);
    const converted = properties.map(prop => {
      const card = convertPropertyToCard(prop);
      return {
        ...card,
        isFavorite: isFavoriteInStore(card.id),
      };
    });
    console.log('✅ Конвертовано:', converted.length, 'properties');
    console.log('📝 Перший конвертований:', converted[0]?.title || 'none');
    return converted;
  }, [properties, favoriteIds, isFavoriteInStore]);

  const pagination = propertiesResponse?.data?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  // Завантаження наступної сторінки
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Оновлення фільтрів
  const handleApplyFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(1); // Скидаємо на першу сторінку
    setAllProperties([]); // Очищаємо список
  };

  // Оновлення пошуку
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setPage(1); // Скидаємо на першу сторінку
    setAllProperties([]); // Очищаємо список
  };

  // Favorites store
  const { toggleFavorite: toggleFavoriteInStore } = useFavoritesStore();
  
  // Перемикання улюбленого
  const toggleFavorite = (id: string) => {
    toggleFavoriteInStore(id);
  };

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setPage(1);
    setAllProperties([]);
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchSection} onStartShouldSetResponder={() => false}>
        <View style={styles.searchBarWrapper}>
        <SearchBar 
          value={searchQuery}
            onChangeText={handleSearchChange}
          placeholder={t('properties.searchPlaceholder')}
        />
        </View>
        <Pressable 
          style={({ pressed }) => [
            styles.filterButton,
            { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => setFiltersVisible(true)}
        >
          <Ionicons name="options-outline" size={20} color={theme.primary} />
        </Pressable>
      </View>

      {/* Filters Modal */}
      <PropertyFiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      {/* Properties List */}
      {isLoading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {t('properties.loading')}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t('properties.errorLoading')}
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            {(error as any)?.message || 'Unknown error'}
          </Text>
            <Pressable
              style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
            </Pressable>
      </View>
      ) : (
      <FlatList
          data={cardProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={theme.primary}
            />
          }
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onScrollStart={() => setScrollEnabled(false)}
            onScrollEnd={() => setScrollEnabled(true)}
            theme={theme}
            t={t}
              router={router}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
            isLoading && page > 1 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                  {t('properties.loadingMore')}
              </Text>
            </View>
            ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={64} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {t('properties.noProperties')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {t('properties.tryAdjustFilters')}
            </Text>
          </View>
        }
      />
      )}
    </SafeAreaView>
  );
}

interface PropertyCardProps {
  property: PropertyCardData;
  onToggleFavorite: () => void;
  onScrollStart: () => void;
  onScrollEnd: () => void;
  theme: any;
  t: any;
  router: any;
}

function PropertyCard({ property, onToggleFavorite, onScrollStart, onScrollEnd, theme, t, router }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Валідація URI для зображень
  const getValidImages = (images: string[] | undefined): string[] => {
    if (!images || images.length === 0) {
      return ['https://via.placeholder.com/400x300?text=No+Image'];
    }
    return images
      .filter(img => img && typeof img === 'string' && img.trim().length > 0)
      .filter(img => {
        // Перевіряємо, чи це валідний URI
        return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('file://');
      })
      .map(img => img.trim());
  };
  
  const images = getValidImages(property.images);
  
  const bedroomsLabel = typeof property.bedrooms === 'string'
    ? property.bedrooms
    : property.bedrooms === 1
    ? t('properties.bedroom')
    : `${property.bedrooms} ${t('properties.bedrooms')}`;
  
  // Форматуємо payment plan (до 2 рядків, без агресивного обрізання)
  const getShortPaymentPlan = (paymentPlan: string | null | undefined): string | null => {
    if (!paymentPlan) return null;
    
    // Видаляємо всі переноси рядків і зайві пробіли, але залишаємо текст для 2 рядків
    const singleLine = paymentPlan.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Не обрізаємо - дозволяємо React Native автоматично переносити на 2 рядки
    return singleLine;
  };
  
  return (
    <View style={styles.propertyCard}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled={true}
        nestedScrollEnabled={true}
        onScrollBeginDrag={onScrollStart}
        onScrollEndDrag={onScrollEnd}
        onScroll={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
          setCurrentImageIndex(index);
        }}
        scrollEventThrottle={16}
        style={styles.imageScroller}
      >
        {images.map((image, index) => (
          <Image
            key={`${property.id}-image-${index}`}
            source={{ uri: image }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {/* Top Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />
      
      {/* Pagination Dots - завжди показуємо максимум 4 крапки, які рухаються при скролі */}
      {images.length > 1 && (() => {
        const maxDots = 4;
        const totalImages = images.length;
        
        // Розраховуємо, які крапки показувати та яка активна
        let dotIndices: number[] = [];
        let activeDotIndex = 0;
        
        if (totalImages <= maxDots) {
          // Якщо фото 4 або менше, показуємо всі
          dotIndices = Array.from({ length: totalImages }, (_, i) => i);
          activeDotIndex = currentImageIndex;
        } else {
          // Якщо фото більше 4, крапки рухаються
          // Розраховуємо відносні позиції (0%, 33%, 67%, 100%)
          dotIndices = [0, Math.floor(totalImages / 3), Math.floor((totalImages * 2) / 3), totalImages - 1];
          
          // Знаходимо найближчу крапку до поточного фото
          activeDotIndex = dotIndices.reduce((closest, pos, idx) => {
            return Math.abs(pos - currentImageIndex) < Math.abs(dotIndices[closest] - currentImageIndex) 
              ? idx 
              : closest;
          }, 0);
        }
        
        return (
          <View style={styles.paginationContainer} pointerEvents="none">
            {dotIndices.map((imageIndex, displayIndex) => (
              <View
                key={displayIndex}
                style={[
                  styles.paginationDot,
                  displayIndex === activeDotIndex && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        );
      })()}
      
      {/* Tags */}
      <View style={styles.tagsContainer} pointerEvents="none">
        <BlurView intensity={20} tint="light" style={styles.tag}>
          <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
            {property.type === 'off-plan' ? 'Off-Plan' : 'Secondary'}
          </Text>
        </BlurView>
        <BlurView intensity={20} tint="light" style={styles.tag}>
          <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
            {bedroomsLabel}
          </Text>
        </BlurView>
      </View>
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}
        pointerEvents="box-none"
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => router.push(`/property/${property.id}`)}
        />
        {/* Property Details */}
        <View style={styles.propertyDetails} pointerEvents="none">
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {property.title}
          </Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>
            {property.location}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.propertyPrice} numberOfLines={1}>
              {formatPrice(property.price, 'USD')}{property.bedrooms ? ` | ${bedroomsLabel}` : ''}
            </Text>
            {getShortPaymentPlan(property.paymentPlan) && (
              <Text 
                style={styles.paymentPlan} 
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {getShortPaymentPlan(property.paymentPlan)}
              </Text>
            )}
          </View>
        </View>

        {/* Favorite Button */}
        <Pressable
          style={({ pressed }) => [
            styles.favoriteButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={(e) => {
            e?.stopPropagation?.();
            onToggleFavorite();
          }}
        >
          <Ionicons
            name={property.isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={property.isFavorite ? '#FF3B30' : '#FFFFFF'}
          />
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 8,
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
  },
  searchBarWrapper: {
    flex: 1,
    minWidth: 0,
  },
  filterButton: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexShrink: 0,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  propertyCard: {
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageScroller: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  propertyImage: {
    width: CARD_WIDTH,
    height: 280,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
  },
  paginationContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 6,
    zIndex: 2,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 18,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    paddingBottom: 13, // Збільшено на 5px (було 8)
    paddingHorizontal: 16,
    paddingTop: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  tagsContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
    zIndex: 1,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  propertyDetails: {
    gap: 3,
    paddingRight: 56, // Залишаємо місце для сердечка (40px button + 16px margin)
    flexShrink: 1,
    marginBottom: 0,
    alignSelf: 'flex-start', // Вирівнюємо по низу
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  propertyLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  priceContainer: {
    marginTop: 4,
    flexShrink: 1,
    width: CARD_WIDTH - 32 - 56, // Ширина картки - padding - місце для сердечка
    gap: 2,
  },
  propertyPrice: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    fontWeight: '600',
  },
  paymentPlan: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 16,
    opacity: 0.9,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  endContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  endText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
