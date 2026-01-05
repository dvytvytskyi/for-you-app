import { View, Text, StyleSheet, FlatList, ScrollView, Pressable, Image, ActivityIndicator, Dimensions, RefreshControl, Platform, LayoutAnimation, UIManager, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter, useNavigation } from 'expo-router';
import { SearchBar } from '@/components/ui';
import PropertyFiltersModal, { PropertyFilters } from '@/components/ui/PropertyFilters';
import { propertiesApi } from '@/api/properties';
import { convertPropertyToCard, convertFiltersToAPI, formatPrice, PropertyCardData } from '@/utils/property-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavoritesStore } from '@/store/favoritesStore';
import { TextInput } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32; // padding left + right

export default function PropertiesScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const searchInputRef = useRef<TextInput>(null);

  // Reset search on tab change
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsSearchFocused(false);
      setSearchQuery('');
    });
    return unsubscribe;
  }, [navigation]);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    listingType: 'all', // Default set to 'all' to ensure everything is visible
    minPrice: null,
    maxPrice: null,
    propertyType: 'all',
    bedrooms: 'any',
    location: 'any',
  });

  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Конвертуємо UI фільтри в API фільтри (стабільні параметри)
  const baseApiFilters = useMemo(() => {
    const baseFilters = convertFiltersToAPI(filters);
    return {
      ...baseFilters,
      search: debouncedSearch || undefined,
      limit: 20,
      sortBy: 'createdAt' as const,
      sortOrder: 'DESC' as const,
    };
  }, [filters, debouncedSearch]);

  // Завантаження properties з API через Infinite Query
  const {
    data: propertiesInfiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useInfiniteQuery({
    queryKey: ['properties', baseApiFilters],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await propertiesApi.getAll({ ...baseApiFilters, page: pageParam });
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження properties:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.pagination;
      if (!pagination) return undefined;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

  // Отримуємо плоский список всіх properties з усіх сторінок
  const properties = useMemo(() => {
    if (!propertiesInfiniteData?.pages) return [];
    return propertiesInfiniteData.pages.flatMap(page => page.data?.data || []);
  }, [propertiesInfiniteData]);

  // Favorites store
  const { isFavorite: isFavoriteInStore, favoriteIds, toggleFavorite: toggleFavoriteInStore } = useFavoritesStore();

  // Конвертуємо properties для UI
  const cardProperties = useMemo(() => {
    return properties.map(prop => {
      // Pass favoriteIds to utility to handle isFavorite check
      return convertPropertyToCard(prop, favoriteIds);
    });
  }, [properties, favoriteIds]);

  // Завантаження наступної сторінки
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Оновлення фільтрів
  const handleApplyFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };

  // Оновлення пошуку
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(true);

    // Robustly ensure keyboard opens
    const attemptFocus = (delay: number) => {
      setTimeout(() => {
        if (searchInputRef.current && !searchInputRef.current.isFocused()) {
          searchInputRef.current.focus();
        }
      }, delay);
    };

    attemptFocus(50);
    attemptFocus(300);
  };

  const handleCancelSearch = () => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  // Перемикання улюбленого
  const handleToggleFavorite = useCallback((id: string) => {
    toggleFavoriteInStore(id);
  }, [toggleFavoriteInStore]);

  const handleScrollStart = useCallback(() => setScrollEnabled(false), []);
  const handleScrollEnd = useCallback(() => setScrollEnabled(true), []);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchSection} onStartShouldSetResponder={() => false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              inputRef={searchInputRef as any}
              value={searchQuery}
              onChangeText={handleSearchChange}
              placeholder={t('properties.searchPlaceholder')}
              onFocus={handleSearchFocus}
            />
          </View>

          {isSearchFocused ? (
            <Pressable onPress={handleCancelSearch} style={{ paddingHorizontal: 4, justifyContent: 'center' }}>
              <Text style={{ color: theme.primary, fontSize: 14 }}>{t('common.cancel') || 'Cancel'}</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.filterButton,
                  { backgroundColor: theme.primaryLight, borderColor: theme.primary },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => router.push('/liked')}
              >
                <Ionicons name="heart-outline" size={20} color={theme.primary} />
                {favoriteIds.length > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: '#FF3B30',
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                    zIndex: 10,
                  }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                      {favoriteIds.length}
                    </Text>
                  </View>
                )}
              </Pressable>

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
            </>
          )}
        </View>
      </View>

      {/* Filters Modal */}
      <PropertyFiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />

      {/* Properties List */}
      {isLoading && !isRefetching ? (
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
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
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
              onToggleFavorite={handleToggleFavorite}
              onScrollStart={handleScrollStart}
              onScrollEnd={handleScrollEnd}
              theme={theme}
              t={t}
              router={router}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loadingMoreFooter}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.loadingMoreText, { color: theme.textSecondary }]}>
                  {t('properties.loadingMore')}
                </Text>
              </View>
            ) : !hasNextPage && cardProperties.length > 0 ? (
              <View style={styles.endContainer}>
                <Text style={[styles.endText, { color: theme.textTertiary }]}>
                  {t('properties.allLoaded')}
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
  onToggleFavorite: (id: string) => void;
  onScrollStart: () => void;
  onScrollEnd: () => void;
  theme: any;
  t: any;
  router: any;
}

const PropertyCard = memo(({ property, onToggleFavorite, onScrollStart, onScrollEnd, theme, t, router }: PropertyCardProps) => {
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
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        style={styles.imageScroller}
      >
        {images.map((image, index) => (
          <Pressable
            key={`${property.id}-image-${index}`}
            onPress={() => router.push(`/property/${property.id}`)}
            style={{ width: CARD_WIDTH, height: 280 }}
          >
            <Image
              source={{ uri: image }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          </Pressable>
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
          style={styles.propertyDetails}
          onPress={() => router.push(`/property/${property.id}`)}
        >
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
        </Pressable>

        {/* Favorite Button */}
        <Pressable
          style={({ pressed }) => [
            styles.favoriteButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={(e) => {
            e?.stopPropagation?.();
            onToggleFavorite(property.id);
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
});

const styles = StyleSheet.create({
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
  loadingMoreFooter: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingMoreText: {
    fontSize: 14,
  },
});
