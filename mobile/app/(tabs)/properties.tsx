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
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';
import { triggerLightHaptic, triggerMediumHaptic } from '@/utils/haptic';
import { TextInput } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32; // padding left + right

export default function PropertiesScreen() {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const navigation = useNavigation();
  const searchInputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const { user } = useAuthStore();

  const isInvestor = user?.role === UserRole.INVESTOR || (user?.role as string) === 'INVESTOR';
  const isAgent = user?.role === UserRole.BROKER || (user?.role as string) === 'BROKER' || (user?.role as string) === 'AGENT';

  // Reset search on tab change
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsSearchFocused(false);
      setSearchQuery('');
    });
    return unsubscribe;
  }, [navigation]);

  // Scroll to top on tab re-press
  useEffect(() => {
    const unsubscribe = (navigation as any).addListener('tabPress', (e: any) => {
      if (navigation.isFocused()) {
        // Already on this screen, so scroll to top
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        triggerLightHaptic();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>({
    listingType: 'offplan', // Set to 'offplan' for Projects tab
    minPrice: null,
    maxPrice: null,
    bedrooms: 'any',
    location: 'any',
    developerIds: 'any',
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);

  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Конвертуємо UI фільтри в API фільтри (стабільні параметри)
  // Конвертуємо UI фільтри в API фільтри (стабільні параметри)
  const baseApiFilters = useMemo(() => {
    const baseFilters = convertFiltersToAPI(filters);

    // Determine sort params based on UI state
    let sortParam: 'createdAt' | 'price' = 'createdAt';
    let sortOrderParam: 'ASC' | 'DESC' = 'DESC';

    if (sortBy === 'price-asc') {
      sortParam = 'price';
      sortOrderParam = 'ASC';
    } else if (sortBy === 'price-desc') {
      sortParam = 'price';
      sortOrderParam = 'DESC';
    }
    // 'newest' uses defaults (createdAt, DESC)

    return {
      ...baseFilters,
      search: debouncedSearch || undefined,
      limit: 20,
      sortBy: sortParam,
      sortOrder: sortOrderParam,
    };
  }, [filters, debouncedSearch, sortBy]);

  // Завантаження проектів (off-plan) з API через Infinite Query
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
    queryKey: ['projects', baseApiFilters, isInvestor, isAgent],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await propertiesApi.getProjects({
          ...baseApiFilters,
          page: pageParam,
          isInvestor,
          isAgent
        });
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження проектів:', error);
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

  // Get total count from first page pagination
  const totalCount = useMemo(() => {
    return propertiesInfiniteData?.pages?.[0]?.data?.pagination?.total || 0;
  }, [propertiesInfiniteData]);

  // Favorites store
  const { isFavorite: isFavoriteInStore, favoriteIds, toggleFavorite: toggleFavoriteInStore } = useFavoritesStore();

  // Конвертуємо properties для UI з сортуванням
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
  const [searchDebounced] = useDebounce(searchQuery, 400);

  // Autocomplete пошук для швидкості
  const {
    data: autocompleteData,
    isLoading: isAutocompleteLoading
  } = useInfiniteQuery({
    queryKey: ['property-autocomplete-tab', searchQuery],
    queryFn: async () => {
      if (searchQuery.trim().length < 2) return [];
      return await propertiesApi.autocompleteSearch(searchQuery);
    },
    initialPageParam: 1,
    getNextPageParam: () => undefined,
    enabled: isSearchFocused && searchQuery.trim().length >= 2,
  });

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length >= 2) {
      const data = (autocompleteData?.pages?.[0] || []) as any[];
      return data.map(item => ({
        id: item.id,
        title: item.name,
        location: item.location,
        images: [item.photo],
        price: 0,
        bedrooms: '...',
        type: 'off-plan' as const,
        isAutocomplete: true
      } as any as PropertyCardData));
    }
    // Коли порожній пошук, але фокус - показуємо Featured з основного запиту
    return cardProperties.slice(0, 10);
  }, [searchQuery, autocompleteData, cardProperties]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleSearchFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(true);
    triggerLightHaptic();

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
    triggerLightHaptic();
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  // Перемикання улюбленого
  const handleToggleFavorite = useCallback((id: string) => {
    triggerLightHaptic();
    toggleFavoriteInStore(id);
  }, [toggleFavoriteInStore]);

  const handleScrollStart = useCallback(() => setScrollEnabled(false), []);
  const handleScrollEnd = useCallback(() => setScrollEnabled(true), []);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: isDark ? theme.background : '#fdfdfd' }]} edges={['top']}>
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
                  { borderColor: theme.primary },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => {
                  triggerLightHaptic();
                  router.push('/liked');
                }}
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
                  { borderColor: theme.primary },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => {
                  triggerMediumHaptic();
                  setFiltersVisible(true);
                }}
              >
                <Ionicons name="options-outline" size={20} color={theme.primary} />
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* Second Row: Count and Sort */}
      {!isSearchFocused && (
        <View style={[styles.statsRow, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.countText, { color: theme.primary }]}>
            {totalCount} {totalCount === 1 ? 'project' : 'projects'}
          </Text>

          <View>
            <Pressable
              style={[styles.sortButton, { borderColor: theme.border }]}
              onPress={() => {
                triggerLightHaptic();
                setSortDropdownVisible(!sortDropdownVisible);
              }}
            >
              <Text style={[styles.sortText, { color: theme.primary }]}>
                {sortBy === 'newest' ? 'Newest' : sortBy === 'price-asc' ? 'Price: Low-High' : 'Price: High-Low'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.primary} />
            </Pressable>

            {sortDropdownVisible && (
              <View style={[styles.sortDropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Pressable
                  style={styles.sortOption}
                  onPress={() => {
                    triggerLightHaptic();
                    setSortBy('newest');
                    setSortDropdownVisible(false);
                  }}
                >
                  <Text style={[styles.sortOptionText, { color: sortBy === 'newest' ? theme.primary : theme.text }]}>
                    Newest
                  </Text>
                  {sortBy === 'newest' && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                </Pressable>

                <Pressable
                  style={styles.sortOption}
                  onPress={() => {
                    triggerLightHaptic();
                    setSortBy('price-asc');
                    setSortDropdownVisible(false);
                  }}
                >
                  <Text style={[styles.sortOptionText, { color: sortBy === 'price-asc' ? theme.primary : theme.text }]}>
                    Price: Low-High
                  </Text>
                  {sortBy === 'price-asc' && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                </Pressable>

                <Pressable
                  style={styles.sortOption}
                  onPress={() => {
                    triggerLightHaptic();
                    setSortBy('price-desc');
                    setSortDropdownVisible(false);
                  }}
                >
                  <Text style={[styles.sortOptionText, { color: sortBy === 'price-desc' ? theme.primary : theme.text }]}>
                    Price: High-Low
                  </Text>
                  {sortBy === 'price-desc' && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                </Pressable>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Search Overlay */}
      {isSearchFocused && (
        <View style={{ flex: 1, position: 'absolute', top: 60, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: isDark ? theme.background : '#fdfdfd' }}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={() => (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: theme.textSecondary }}>
                  {searchQuery.length > 0 ? 'No projects found' : 'Type to search projects'}
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? theme.backgroundSecondary : theme.background,
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    alignItems: 'center',
                    gap: 12,
                    borderBottomWidth: 0.5,
                    borderBottomColor: theme.border
                  }
                ]}
                onPress={() => {
                  triggerLightHaptic();
                  router.push(`/property/${item.id}`);
                }}
              >
                <View style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: theme.border, overflow: 'hidden' }}>
                  {item.images?.[0] && (
                    <Image source={{ uri: item.images[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  )}
                </View>

                <View style={{ flex: 1, justifyContent: 'center', gap: 2 }}>
                  <Text style={[{ color: theme.text, fontSize: 14, fontWeight: '600' }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={[{ color: theme.textSecondary, fontSize: 13 }]} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>

                <View style={{ alignSelf: 'stretch', alignItems: 'flex-end', justifyContent: 'flex-end', paddingBottom: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: theme.primary }}>
                    {(item as any).isAutocomplete ? 'See project' : formatPrice(item.price)}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}

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
          ref={flatListRef}
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
        return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('file://');
      })
      .map(img => img.trim());
  };

  const images = getValidImages(property.images);

  const bedroomsLabel = typeof property.bedrooms === 'string'
    ? `${property.bedrooms} ${t('properties.bedrooms') || 'bedrooms'}`
    : property.bedrooms === 1
      ? `1 ${t('properties.bedroom') || 'bedroom'}`
      : `${property.bedrooms} ${t('properties.bedrooms') || 'bedrooms'}`;

  // Форматуємо payment plan
  const getShortPaymentPlan = (paymentPlan: string | null | undefined): string | null => {
    if (!paymentPlan) return null;
    return paymentPlan.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
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
        snapToAlignment="center"
        disableIntervalMomentum={Platform.OS === 'ios'}
        decelerationRate="fast"
        style={styles.imageScroller}
      >
        {images.map((image, index) => (
          <Pressable
            key={`${property.id}-image-${index}`}
            onPress={() => {
              triggerLightHaptic();
              router.push(`/property/${property.id}`);
            }}
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

      {/* Pagination Dots */}
      {images.length > 1 && (() => {
        const maxDots = 5;
        const totalImages = images.length;
        let dotIndices: number[] = [];
        let activeDotIndex = 0;

        if (totalImages <= maxDots) {
          dotIndices = Array.from({ length: totalImages }, (_, i) => i);
          activeDotIndex = currentImageIndex;
        } else {
          dotIndices = [0, Math.floor(totalImages / 4), Math.floor(totalImages / 2), Math.floor((totalImages * 3) / 4), totalImages - 1];
          activeDotIndex = dotIndices.reduce((closest, pos, idx) => {
            return Math.abs(pos - currentImageIndex) < Math.abs(dotIndices[closest] - currentImageIndex) ? idx : closest;
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

        {property.developerName && (
          <BlurView intensity={20} tint="light" style={styles.tag}>
            <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
              {property.developerName}
            </Text>
          </BlurView>
        )}

        {property.projectedRoi && (
          <BlurView intensity={30} tint="dark" style={[styles.tag, { backgroundColor: 'rgba(52, 199, 89, 0.3)' }]}>
            <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
              ROI: {property.projectedRoi}
            </Text>
          </BlurView>
        )}

        {property.commission && (
          <BlurView intensity={30} tint="dark" style={[styles.tag, { backgroundColor: 'rgba(175, 82, 222, 0.3)' }]}>
            <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
              Com: {property.commission}
            </Text>
          </BlurView>
        )}

        {property.isInvestorFeatured && (
          <BlurView intensity={30} tint="dark" style={[styles.tag, { backgroundColor: 'rgba(255, 214, 10, 0.3)' }]}>
            <Ionicons name="star" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={[styles.tagText, { color: '#FFFFFF' }]}>Featured</Text>
          </BlurView>
        )}
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}
        pointerEvents="box-none"
      >
        <Pressable
          style={styles.propertyDetails}
          onPress={() => {
            triggerLightHaptic();
            router.push(`/property/${property.id}`);
          }}
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
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countText: {
    fontSize: 13,
    fontWeight: '400',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '400',
  },
  sortDropdown: {
    position: 'absolute',
    top: 38,
    right: 0,
    minWidth: 160,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 1000,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '400',
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
    paddingBottom: 100, // Increased to avoid TabBar overlap
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
    gap: 3,
    zIndex: 2,
  },
  paginationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    backgroundColor: '#FFFFFF',
    width: 6,
    height: 6,
    borderRadius: 3,
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
    top: 10,
    left: 12,
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
