import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Pressable, ActivityIndicator, LayoutAnimation, Keyboard, Platform, UIManager, Animated, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { UserRole } from '@/types/user';
import { Header, SearchBar, LocationFilter, PropertyCard, PaginationDots, CollectionCard, StatsCard, SmallStatCard, QuickActionCard, NewsCard, DeveloperCard } from '@/components/ui';
import { useRouter, useNavigation } from 'expo-router';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { propertiesApi, OffPlanProperty, SecondaryProperty } from '@/api/properties';
import { newsApi } from '@/api/news';
import { coursesApi } from '@/api/courses';
import { developersApi } from '@/api/developers';
import { leadsApi } from '@/api/leads';
import { formatPrice, convertPropertyToCard, PropertyCardData } from '@/utils/property-utils';
import { crmStatsApi } from '@/api/crm-stats';
import { useCollectionsStore } from '@/store/collectionsStore';
import { triggerLightHaptic, triggerMediumHaptic } from '@/utils/haptic';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 8;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);

import { useFavoritesStore } from '@/store/favoritesStore';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const { favoriteIds, isFavorite, toggleFavorite } = useFavoritesStore();
  const user = useAuthStore((state) => state.user);
  // Явна перевірка ролі - переконуємося, що це точно строка 'INVESTOR'
  const isInvestor = (user?.role as string) === 'INVESTOR' || user?.role === UserRole.INVESTOR;
  const isAgent = (user?.role as string) === 'BROKER' || user?.role === UserRole.BROKER || (user?.role as string) === 'AGENT';

  // Debug: log user role
  useEffect(() => {
    console.log('=== HOME SCREEN ===');
    console.log('User:', user);
    console.log('User role:', user?.role);
    console.log('User role type:', typeof user?.role);
    console.log('Is Investor:', isInvestor);
    console.log('Should hide Stats:', !isInvestor);
  }, [user, isInvestor]);

  // Reset search on tab change
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsSearchFocused(false);
      setSearchQuery('');
    });
    return unsubscribe;
  }, [navigation]);

  // Завантаження статистики CRM (тільки для брокерів)
  const { data: crmStats, isLoading: crmStatsLoading } = useQuery({
    queryKey: ['crm-stats'],
    queryFn: async () => {
      console.log('🔄 Завантаження CRM статистики...');
      try {
        const stats = await crmStatsApi.getMyStats();
        console.log('✅ CRM статистика завантажена:', stats);
        return stats;
      } catch (error: any) {
        console.error('❌ Помилка завантаження CRM статистики:', error);
        // Повертаємо дефолтні значення при помилці
        return {
          newLeads: 0,
          totalLeads: 0,
          activeDeals: 0,
          totalAmount: 0,
        };
      }
    },
    enabled: !isInvestor && !!user, // Тільки для брокерів та коли користувач авторизований
    retry: 1,
    staleTime: 30000, // Дані вважаються актуальними 30 секунд
  });

  // Завантаження properties з API
  const { data: propertiesResponse, isLoading: propertiesLoading, error: propertiesError } = useQuery({
    queryKey: ['home-properties'],
    queryFn: async () => {
      console.log('🔄 Завантаження properties (projects) для home...');
      try {
        const response = await propertiesApi.getProjects({
          page: 1,
          limit: 30,
          isInvestor,
          isAgent
        });
        console.log('✅ Projects завантажено для home:', response?.data?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження проектів для home:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Завантаження лідів для правого слайду
  const { data: leadsResponse, isLoading: leadsLoading } = useQuery({
    queryKey: ['home-all-leads'],
    queryFn: async () => {
      if (isInvestor) return { data: [], total: 0 };
      try {
        const result = await leadsApi.getAll({ limit: 10 }); // Наприклад, показуємо перші 10
        return result;
      } catch (error) {
        console.error('Error fetching leads for home:', error);
        return { data: [], total: 0 };
      }
    },
    enabled: !isInvestor && !!user,
  });

  const allLeads = useMemo(() => leadsResponse?.data || [], [leadsResponse]);

  // Завантаження Liked properties для лівого слайду
  const { data: likedPropertiesResponse, isLoading: likedLoading } = useQuery({
    queryKey: ['home-liked-properties', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) return [];
      try {
        // Отримуємо декілька пропертіс по ID
        // Оскільки у нас немає getByIds, можемо просто взяти з Featured або зробити пошук
        // Для спрощення, поки беремо результати які є або мокаємо
        const response = await propertiesApi.getProjects({ limit: 10, isInvestor, isAgent });
        return response?.data?.data?.filter(p => favoriteIds.includes(p.id)) || [];
      } catch (error) {
        console.error('Error fetching liked for home:', error);
        return [];
      }
    },
    enabled: favoriteIds.length > 0,
  });

  const likedProperties = useMemo(() => {
    // Якщо у нас є дані з основного запиту, використовуємо їх також
    const allFetched = propertiesResponse?.data?.data || [];
    const fromMain = allFetched
      .filter(p => favoriteIds.includes(p.id))
      .map(p => convertPropertyToCard(p, favoriteIds));

    // Об'єднуємо
    const combined = [...fromMain];
    const combinedIds = new Set(combined.map(p => p.id));

    (likedPropertiesResponse || [])
      .map(p => convertPropertyToCard(p, favoriteIds))
      .forEach(p => {
        if (!combinedIds.has(p.id)) combined.push(p);
      });

    return combined;
  }, [likedPropertiesResponse, propertiesResponse, favoriteIds]);

  // Форматування total amount
  const formatTotalAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)} M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)} K`;
    }
    return `$${amount.toFixed(0)} `;
  };
  // Enable LayoutAnimation for Android
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]); // Default empty
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search Animation State
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Action Button Animation (Heart -> Search)
  const [showSearchAction, setShowSearchAction] = useState(false);
  const actionButtonAnim = useRef(new Animated.Value(0)).current;

  // New swipable block state
  const pagerRef = useRef<ScrollView>(null);
  const [activePageIndex, setActivePageIndex] = useState(1); // Default to center (home widgets)
  const [isPagerInitialized, setIsPagerInitialized] = useState(false);

  useEffect(() => {
    Animated.timing(actionButtonAnim, {
      toValue: showSearchAction ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showSearchAction]);



  // Початкові результати для пошукового екрану (коли ще нічого не введено)
  const {
    data: searchResultsData,
    isLoading: searchLoadingInfinite,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['property-search-initial'],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await propertiesApi.getProjects({ limit: 50, page: pageParam as number, isInvestor, isAgent });
      if (response?.data?.data && pageParam === 1) {
        response.data.data.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
      }
      return response;
    },
    getNextPageParam: (lastPage: any) => {
      if (lastPage?.data?.pagination) {
        const { page, totalPages } = lastPage.data.pagination;
        return page < totalPages ? page + 1 : undefined;
      }
      return undefined;
    },
    enabled: isSearchFocused,
    staleTime: 10 * 60 * 1000,
  });

  const scrollX = useRef(new Animated.Value(0)).current;

  const handlePagerScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );
  // Нова логіка пошуку: Autocomplete для швидкості
  const {
    data: autocompleteData,
    isLoading: isAutocompleteLoading
  } = useQuery({
    queryKey: ['property-autocomplete', debouncedSearchQuery],
    queryFn: () => propertiesApi.autocompleteSearch(debouncedSearchQuery),
    enabled: debouncedSearchQuery.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const searchResults = useMemo(() => {
    if (debouncedSearchQuery.trim().length >= 2) {
      // Повертаємо результати з autocomplete
      return (autocompleteData || []).map(item => ({
        id: item.id,
        title: item.name,
        location: item.location,
        images: [item.photo],
        price: 0,
        bedrooms: '...', // Autocomplete не повертає к-сть спалень
        type: 'off-plan' as const,
        isAutocomplete: true
      } as any as PropertyCardData));
    }

    // Якщо пошуку немає, показуємо початкові результати (Featured)
    const rawData = searchResultsData?.pages.flatMap((page: any) => page?.data?.data || []) || [];
    return rawData.map(p => convertPropertyToCard(p, favoriteIds));
  }, [debouncedSearchQuery, autocompleteData, searchResultsData, favoriteIds]);

  const searchLoading = debouncedSearchQuery.trim().length >= 2 ? isAutocompleteLoading : searchLoadingInfinite;

  const handleSearchFocus = () => {
    triggerLightHaptic();
    setIsSearchFocused(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    navigation.setOptions({ tabBarStyle: { display: 'none' } });

    // Robustly ensure keyboard opens
    setTimeout(() => {
      if (searchInputRef.current && !searchInputRef.current.isFocused()) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleCancelSearch = () => {
    triggerLightHaptic();
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(false);
    setSearchQuery('');
    navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  };

  // Collections count from store
  const collectionsFromStore = useCollectionsStore((state) => state.collections);



  // Конвертуємо properties для UI
  const properties = useMemo(() => {
    if (!propertiesResponse?.data?.data) {
      return [];
    }
    return propertiesResponse.data.data.slice(0, 30).map(p => convertPropertyToCard(p, favoriteIds));
  }, [propertiesResponse, favoriteIds]);

  // Завантаження новин з API
  const { data: newsResponse, isLoading: newsLoading } = useQuery({
    queryKey: ['home-news'],
    queryFn: async () => {
      console.log('🔄 Завантаження новин для home...');
      try {
        const response = await newsApi.getPublished({
          page: 1,
          limit: 10, // Get more and filter/sort in memo
        });
        console.log('✅ Новини завантажено:', response?.data?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження новин:', error);
        throw error;
      }
    },
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });

  // Конвертуємо новини для UI
  const news = useMemo(() => {
    if (!newsResponse?.data?.data) {
      return [];
    }

    // Сортуємо за датою публікації (найновіші першими) та обмежуємо до 5
    const sortedNews = [...newsResponse.data.data].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, 5);

    return sortedNews.map((newsItem) => {
      // Форматуємо дату
      const formatTimestamp = (dateString: string | null) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
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
      };

      // Валідація URI для зображення
      const getValidImageUri = (imageUrl: string | null | undefined): string => {
        if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
          return 'https://via.placeholder.com/400x300?text=No+Image';
        }
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:') || imageUrl.startsWith('file://')) {
          return imageUrl;
        }
        return 'https://via.placeholder.com/400x300?text=No+Image';
      };

      return {
        id: newsItem.id,
        image: getValidImageUri(newsItem.imageUrl || newsItem.image),
        title: newsItem.title,
        description: newsItem.description || '',
        timestamp: formatTimestamp(newsItem.publishedAt || newsItem.createdAt || null),
        rawDate: newsItem.publishedAt || newsItem.createdAt || null,
        slug: newsItem.slug || newsItem.id,
      };
    });
  }, [newsResponse]);

  // Завантаження курсів з API для Knowledge Base
  const { data: coursesResponse } = useQuery({
    queryKey: ['home-courses'],
    queryFn: async () => {
      console.log('🔄 Завантаження курсів для home...');
      try {
        const response = await coursesApi.getAll();
        console.log('✅ Курси завантажено для home:', response?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження курсів для home:', error);
        throw error;
      }
    },
    retry: 1,
  });

  interface KnowledgeModule {
    id: string;
    title: string;
    author: string;
    completion: number;
    status: 'not-started' | 'in-progress' | 'completed';
    topicId: string;
    createdAt: string;
  }

  // Конвертуємо курси в формат для UI (обмежуємо до 5)
  const knowledgeBaseModules = useMemo((): KnowledgeModule[] => {
    if (!coursesResponse?.data) {
      return [];
    }

    return coursesResponse.data.slice(0, 5).map((course) => {
      const apiStatus = course.userProgress?.status || 'NOT_STARTED';
      let uiStatus: 'not-started' | 'in-progress' | 'completed' = 'not-started';

      if (apiStatus === 'COMPLETED') uiStatus = 'completed';
      else if (apiStatus === 'IN_PROGRESS') uiStatus = 'in-progress';

      return {
        id: course.id,
        title: course.title,
        author: 'Made by ForYou Real Estate',
        completion: course.userProgress?.completionPercentage || 0,
        status: uiStatus,
        topicId: 'all',
        createdAt: course.createdAt || new Date().toISOString(),
      };
    });
  }, [coursesResponse]);

  // Завантаження девелоперів з API
  const { data: developersResponse, isLoading: developersLoading, error: developersError, refetch: refetchDevelopers } = useQuery({
    queryKey: ['home-developers'],
    queryFn: async () => {
      console.log('🔄 Завантаження developers для home...');
      try {
        const response = await developersApi.getAll();
        console.log('✅ Developers завантажено:', response?.data?.length || 0);
        console.log('📋 Перший developer:', response?.data?.[0]?.name || 'none');
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження developers:', error);
        console.error('Error details:', error?.response?.data);
        console.error('Error status:', error?.response?.status);
        throw error;
      }
    },
    staleTime: 0, // Дані вважаються застарілими одразу
    gcTime: 0, // Не кешуємо дані
    refetchOnMount: true, // Завжди завантажуємо при монтуванні
    refetchOnWindowFocus: true, // Оновлюємо дані при поверненні на екран
    refetchOnReconnect: true, // Оновлюємо дані при відновленні з'єднання
    retry: 1,
  });

  // Конвертуємо developers для UI (обмежуємо до 5)
  const developers = useMemo(() => {
    const fullResponseStr = developersResponse
      ? JSON.stringify(developersResponse, null, 2).substring(0, 500)
      : 'null';

    console.log('📦 Конвертація developers:', {
      hasResponse: !!developersResponse,
      success: developersResponse?.success,
      hasData: !!developersResponse?.data,
      dataLength: developersResponse?.data?.length || 0,
      dataType: typeof developersResponse?.data,
      isArray: Array.isArray(developersResponse?.data),
      fullResponse: fullResponseStr,
    });

    if (!developersResponse) {
      console.warn('⚠️ Немає response для developers');
      return [];
    }

    if (!developersResponse.success) {
      console.warn('⚠️ Response success = false');
      return [];
    }

    if (!developersResponse.data) {
      console.warn('⚠️ Немає даних для developers');
      return [];
    }

    if (!Array.isArray(developersResponse.data)) {
      console.error('❌ developersResponse.data не є масивом:', typeof developersResponse.data);
      return [];
    }

    // ID тестових девелоперів, які мають бути першими
    const priorityDeveloperIds = [
      '155eaa8e-3708-449a-8348-16d25d0cf318', // Emaar Properties
      '15c2c5bc-f653-4991-9220-aa2699b2b8e7', // DAMAC Properties
    ];

    // Фільтруємо: тільки ті, що мають лого
    const filteredDevelopers = (developersResponse.data || []).filter(d => !!d.logo);

    // Сортуємо: спочатку пріоритетні, потім решта
    const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
      const aIndex = priorityDeveloperIds.indexOf(a.id);
      const bIndex = priorityDeveloperIds.indexOf(b.id);

      // Якщо обидва в пріоритетних - зберігаємо порядок
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // Якщо тільки a в пріоритетних - він перший
      if (aIndex !== -1) return -1;
      // Якщо тільки b в пріоритетних - він перший
      if (bIndex !== -1) return 1;
      // Інакше зберігаємо оригінальний порядок
      return 0;
    });

    const developersList = sortedDevelopers.slice(0, 5);
    console.log('✅ Конвертація developers:', developersList.length, 'developers');
    console.log('📋 Перші девелопери:', developersList.map(d => ({ name: d.name, id: d.id })));

    const converted = developersList.map((developer) => {
      const result = {
        id: developer.id,
        logo: developer.logo,
        name: developer.name,
        description: developer.description,
        projectsCount: developer.projectsCount?.total || 0,
      };
      console.log('📋 Developer converted:', result.name, 'projects:', result.projectsCount);
      return result;
    });

    console.log('✅ Конвертація завершена:', converted.length, 'developers');
    return converted;
  }, [developersResponse]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} `;
  };



  const renderPropertyCard = useCallback(({ item }: { item: any }) => {
    const isFav = isFavorite(item.id);

    // Safety check - if item is undefined, don't render anything
    if (!item) return null;

    const handlePropertyPress = () => {
      triggerLightHaptic();
      router.push(`/property/${item.id}`);
    };

    const handleFavoriteToggle = (id: string, e: any) => {
      triggerLightHaptic();
      toggleFavorite(id);
    };

    return (
      <View style={{ width: CARD_WIDTH }}>
        <PropertyCard
          {...item}
          theme={theme}
          onPress={handlePropertyPress}
          onToggleFavorite={handleFavoriteToggle}
          isFavorite={isFav}
        />
      </View>
    );
  }, [isFavorite, toggleFavorite, theme, router]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
    setCurrentSlide(slideIndex);
  };

  const renderSearchSection = () => (
    <View style={styles.searchSection}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <SearchBar
            inputRef={searchInputRef as any}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            autoFocus={isSearchFocused}
            containerStyle={isSearchFocused ? { height: 40, borderRadius: 12 } : undefined}
          />
        </View>

        {isSearchFocused ? (
          <Pressable
            onPress={handleCancelSearch}
            style={({ pressed }) => ({
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: theme.background,
              borderWidth: 1,
              borderColor: theme.border,
              opacity: pressed ? 0.7 : 1
            })}
          >
            <Ionicons name="close" size={24} color={theme.primary} />
          </Pressable>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              style={({ pressed }) => [
                styles.filterButton,
                { borderColor: theme.primary },
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={() => {
                if (showSearchAction) {
                  // Перехід на Properties з вибраною локацією
                  const params: any = { propertyType: 'all' };
                  if (selectedLocations.length > 0) {
                    params.location = selectedLocations.join(',');
                  }
                  router.push({ pathname: '/(tabs)/properties', params });
                } else {
                  // Перехід на Liked
                  router.push('/liked');
                }
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/* Heart Icon (Default) */}
                <Animated.View style={{
                  position: 'absolute',
                  opacity: actionButtonAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                  transform: [{ scale: actionButtonAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]
                }}>
                  <Ionicons name="heart-outline" size={24} color={theme.primary} />
                  {favoriteIds.length > 0 && !showSearchAction && (
                    <View style={{
                      position: 'absolute',
                      top: -6,
                      right: -8,
                      backgroundColor: '#FF3B30',
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}>
                      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                        {favoriteIds.length}
                      </Text>
                    </View>
                  )}
                </Animated.View>

                {/* Search Icon (Active) */}
                <Animated.View style={{
                  opacity: actionButtonAnim,
                  transform: [
                    { scale: actionButtonAnim },
                    { rotate: actionButtonAnim.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) }
                  ]
                }}>
                  <Ionicons name="search" size={24} color={theme.primary} />
                </Animated.View>
              </View>
            </Pressable>
          </View>
        )}
      </View>

      {!isSearchFocused && (
        <LocationFilter
          selectedLocations={selectedLocations}
          onLocationsChange={(locs) => {
            setSelectedLocations(locs);
            // Якщо вибрано локації, перемикаємось на іконку пошуку
            if (locs.length > 0) {
              setShowSearchAction(true);
            } else {
              // Якщо нічого не вибрано, можна повернути лайк (опціонально)
              // setShowSearchAction(false);
            }
          }}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Fixed Top Section: Search (only when focused) */}
      <View style={{ zIndex: 100, backgroundColor: theme.background }}>
        {isSearchFocused && renderSearchSection()}
      </View>

      {/* Main Content Area */}
      <View style={{ flex: 1, zIndex: 1 }}>
        {isSearchFocused && (
          <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundColor: theme.background }}>
            {searchLoading ? (
              <View style={styles.searchLoading}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                style={{ flex: 1, width: '100%', backgroundColor: theme.background }}
                contentContainerStyle={{ paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={true}
                onEndReached={() => {
                  if (hasNextPage) fetchNextPage();
                }}
                onEndReachedThreshold={0.5}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 84 }} />
                )}
                ListFooterComponent={() => (
                  isFetchingNextPage ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <ActivityIndicator size="small" color={theme.primary} />
                    </View>
                  ) : <View style={{ height: 20 }} />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.searchNoResults}>
                    <Text style={[styles.searchNoResultsText, { color: theme.textSecondary }]}>
                      {t('home.noProperties') || 'No properties found'}
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
                        paddingVertical: 8,
                        alignItems: 'center',
                        gap: 12,
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
                      <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary }}>
                        {(item as any).isAutocomplete ? 'See project' : formatPrice(item.price)}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
            )}
          </View>
        )}
        <View style={{ flex: 1, display: isSearchFocused ? 'none' : 'flex' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 90 }}
          >
            <Header
              title=""
              avatar={user?.avatar || undefined}
              user={user ? { firstName: user.firstName || '', lastName: user.lastName || '' } : undefined}
              mode="home"
            />
            {/* Main Home Widgets (Pager Removed) */}
            <View style={{ marginBottom: 20 }}>
              {renderSearchSection()}
              {/* Stats Section - Only for Broker */}
              {!isInvestor && (
                <View style={styles.statsSection}>
                  <StatsCard
                    title={t('home.newLeads')}
                    value={crmStatsLoading ? '...' : (crmStats?.totalLeads?.toString() || '0')}
                    buttonText={t('home.explore')}
                    onPress={() => {
                      triggerLightHaptic();
                      router.push('/(tabs)/crm');
                    }}
                  />

                  <View style={styles.smallStatsRow}>
                    <SmallStatCard
                      icon="layers-outline"
                      title={t('home.collections')}
                      value={collectionsFromStore.length.toString()}
                    />
                    <SmallStatCard
                      icon="heart-outline"
                      title="Total likes"
                      value={String(favoriteIds.length)}
                    />
                  </View>
                </View>
              )}

              <View style={styles.collectionSection}>
                <CollectionCard
                  icon="thumbs-up"
                  title={t('home.yourLikedProjects')}
                  description={t('home.collectionDescription')}
                  gradientImage={require('@/assets/images/gradient-1.png')}
                  onPress={() => {
                    triggerLightHaptic();
                    router.push('/liked');
                  }}
                />
              </View>

              <View style={styles.quickActionsSection}>
                {!isInvestor && (
                  <QuickActionCard
                    icon="people"
                    label={t('home.myLeads')}
                    onPress={() => router.push('/(tabs)/crm')}
                  />
                )}
                <QuickActionCard
                  icon="home"
                  label={t('home.properties')}
                  onPress={() => router.push('/(tabs)/properties')}
                />
                <QuickActionCard
                  icon={isInvestor ? "wallet" : "layers"}
                  label={isInvestor ? "Portfolio" : t('home.collections')}
                  onPress={() => {
                    triggerLightHaptic();
                    router.push(isInvestor ? '/portfolio' : '/collections');
                  }}
                />
              </View>
            </View>

            <View style={styles.propertySection}>
              <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Properties</Text>
                <Pressable onPress={() => { triggerLightHaptic(); router.push('/(tabs)/properties'); }}>
                  <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('home.viewAll')}</Text>
                </Pressable>
              </View>

              {propertiesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                </View>
              ) : propertiesError ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.error || '#FF3B30' }]}>
                    Помилка завантаження: {(propertiesError as any)?.message || 'Unknown error'}
                  </Text>
                </View>
              ) : properties.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    {t('home.noProperties')}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={properties.slice(0, 6)}
                  renderItem={renderPropertyCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                  snapToInterval={CARD_WIDTH + CARD_GAP}
                  decelerationRate="fast"
                  contentContainerStyle={styles.flatListContent}
                  ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                />
              )}

              <View style={styles.dotsContainer}>
                <PaginationDots total={properties.slice(0, 6).length} current={currentSlide} />
              </View>
            </View>

            {/* Developers Section */}
            <View style={styles.developersSection}>
              <View style={styles.developersHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Developers</Text>
                <Pressable onPress={() => { triggerLightHaptic(); router.push('/developers'); }}>
                  <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('home.viewAll')}</Text>
                </Pressable>
              </View>

              {(() => {
                console.log('🔍 Рендер Developers Section:', {
                  loading: developersLoading,
                  error: !!developersError,
                  errorMessage: developersError ? (developersError as any)?.message : null,
                  developersCount: developers.length,
                  hasResponse: !!developersResponse,
                  responseData: developersResponse?.data?.length || 0,
                });

                if (developersLoading) {
                  return (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={theme.primary} />
                      <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                        Loading developers...
                      </Text>
                    </View>
                  );
                }

                if (developersError) {
                  const errorMessage = (developersError as any)?.response?.data?.message
                    || (developersError as any)?.message
                    || 'Unknown error';
                  console.error('❌ Developers Error Details:', {
                    message: errorMessage,
                    status: (developersError as any)?.response?.status,
                    data: (developersError as any)?.response?.data,
                  });

                  return (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="alert-circle-outline" size={32} color={theme.textTertiary} />
                      <Text style={[styles.emptyText, { color: theme.error || '#FF3B30', marginTop: 8 }]}>
                        Error loading developers
                      </Text>
                      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                        {errorMessage}
                      </Text>
                      <Pressable
                        style={({ pressed }) => [
                          styles.retryButton,
                          { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }
                        ]}
                        onPress={() => {
                          console.log('🔄 Retry developers...');
                          refetchDevelopers();
                        }}
                      >
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </Pressable>
                    </View>
                  );
                }

                if (developers.length === 0) {
                  console.warn('⚠️ Developers array is empty');
                  return (
                    <View style={styles.emptyContainer}>
                      <Ionicons name="business-outline" size={32} color={theme.textTertiary} />
                      <Text style={[styles.emptyText, { color: theme.textSecondary, marginTop: 8 }]}>
                        No developers available
                      </Text>
                    </View>
                  );
                }

                console.log('✅ Rendering', developers.length, 'developers');
                return developers.map((developer) => (
                  <DeveloperCard
                    key={developer.id}
                    logo={developer.logo}
                    name={developer.name}
                    description={developer.description}
                    projectsCount={developer.projectsCount}
                    gradientImage={require('@/assets/images/gradient-2.png')}
                    onPress={() => router.push(`/developers/${developer.id}`)}
                  />
                ));
              })()}
            </View>

            {/* News Section */}
            <View style={styles.newsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.recentMarketNews')}</Text>

              {newsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
              ) : news.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No news available
                  </Text>
                </View>
              ) : (
                news.map((item, index) => {
                  if (index === 0) {
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => router.push(`/news/${item.slug}`)}
                        style={{
                          marginBottom: 8,
                          borderRadius: 16,
                          overflow: 'hidden',
                          backgroundColor: theme.card,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      >
                        <Image
                          source={{ uri: item.image || 'https://via.placeholder.com/400x300' }}
                          style={{ width: '100%', aspectRatio: 1 }}
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)']}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: 16,
                            paddingTop: 80,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: 12 }}>
                            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'uppercase' }}>
                              Today
                            </Text>
                          </View>

                          <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 16, lineHeight: 28 }} numberOfLines={3}>
                            {item.title}
                          </Text>

                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Image
                                source={require('@/assets/images/new logo.png')}
                                style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#1A1A1A' }}
                                resizeMode="contain"
                              />
                              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>ForYou Real Estate</Text>
                            </View>
                            <Text style={{ color: '#ccc', fontSize: 11 }}>
                              {new Date((item as any).rawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </Text>
                          </View>
                        </LinearGradient>
                      </Pressable>
                    );
                  }

                  return (
                    <NewsCard
                      key={item.id}
                      image={item.image}
                      title={item.title}
                      description={item.description}
                      timestamp={item.timestamp}
                      onPress={() => router.push(`/news/${item.slug}`)}
                    />
                  );
                })
              )}
            </View>

            {/* Knowledge Base Section - Hidden for Investors */}
            {!isInvestor && (
              <View style={styles.knowledgeBaseSection}>
                <View style={styles.knowledgeBaseHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.knowledgeBase')}</Text>
                  <Pressable onPress={() => { triggerLightHaptic(); router.push('/profile/knowledge-base'); }}>
                    <Text style={[styles.viewAllText, { color: theme.primary }]}>{t('home.viewAll')}</Text>
                  </Pressable>
                </View>

                {knowledgeBaseModules.length === 0 ? (
                  <View style={styles.emptyKnowledgeContainer}>
                    <Text style={[styles.emptyKnowledgeText, { color: theme.textSecondary }]}>
                      No courses available
                    </Text>
                  </View>
                ) : (
                  knowledgeBaseModules.map((module) => (
                    <Pressable
                      key={module.id}
                      style={[
                        styles.knowledgeModuleCard,
                        { backgroundColor: theme.card, borderColor: theme.border },
                      ]}
                      onPress={() => {
                        triggerLightHaptic();
                        router.push(`/profile/module/${module.id}`);
                      }}
                    >
                      <View style={styles.knowledgeModuleContent}>
                        <Text style={[styles.knowledgeModuleTitle, { color: theme.text }]} numberOfLines={2}>
                          {module.title}
                        </Text>
                        <View style={[
                          styles.knowledgeStatusBadge,
                          {
                            backgroundColor:
                              module.status === 'completed' ? '#2ECC71' :
                                module.status === 'in-progress' ? '#FFB300' :
                                  theme.primary
                          }
                        ]}>
                          <Text style={styles.knowledgeStatusBadgeText}>
                            {module.status === 'completed' ? 'Completed' :
                              module.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                          </Text>
                        </View>
                        <Text style={[styles.knowledgeModuleAuthor, { color: theme.textSecondary }]}>
                          {module.author} • {formatDate(module.createdAt)}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward-outline" size={20} color={theme.textSecondary} />
                    </Pressable>
                  ))
                )}
              </View>
            )}
            {/* Vertical Property Feed (New Content) - Removed */}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor applied dynamically via theme
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flexShrink: 0,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  smallStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  propertySection: {
    paddingTop: 12,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  dotsContainer: {
    alignItems: 'center',
  },
  collectionSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  developersSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 6,
  },
  developersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  newsSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 12,
  },
  knowledgeBaseSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 100,
    gap: 12,
  },
  knowledgeBaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  knowledgeModuleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  knowledgeModuleContent: {
    flex: 1,
  },
  knowledgeModuleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  knowledgeStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  knowledgeStatusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  knowledgeModuleAuthor: {
    fontSize: 12,
    fontWeight: '400',
  },
  emptyKnowledgeContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyKnowledgeText: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color applied dynamically via theme
    marginBottom: 4,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#010312',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    overflow: 'hidden',
  },
  searchResultsList: {
    maxHeight: 300, // Roughly 6 items (around 50px each)
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  searchResultTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultLocation: {
    fontSize: 12,
    marginTop: 2,
  },
  searchLoading: {
    padding: 20,
    alignItems: 'center',
  },
  searchNoResults: {
    padding: 20,
    alignItems: 'center',
  },
  searchNoResultsText: {
    fontSize: 14,
  },
  slideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptySlideContainer: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptySlideText: {
    fontSize: 14,
  },
  smallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  smallCardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  leadItemRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 4,
  },
  leadAvatarCircleNew: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadItemNameNew: {
    fontSize: 14,
    fontWeight: '600',
  },
  stageBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  viewBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

