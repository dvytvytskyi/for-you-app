import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserRole } from '@/types/user';
import { Header, SearchBar, PropertyTypeFilter, PropertyCard, PaginationDots, CollectionCard, StatsCard, SmallStatCard, QuickActionCard, NewsCard, DeveloperCard } from '@/components/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { propertiesApi, OffPlanProperty, SecondaryProperty } from '@/api/properties';
import { newsApi } from '@/api/news';
import { coursesApi } from '@/api/courses';
import { developersApi } from '@/api/developers';
import { formatPrice } from '@/utils/property-utils';
import { crmStatsApi } from '@/api/crm-stats';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 8;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  // Явна перевірка ролі - переконуємося, що це точно строка 'INVESTOR'
  const isInvestor = user?.role === 'INVESTOR' || user?.role === UserRole.INVESTOR;
  
  // Debug: log user role
  useEffect(() => {
    console.log('=== HOME SCREEN ===');
    console.log('User:', user);
    console.log('User role:', user?.role);
    console.log('User role type:', typeof user?.role);
    console.log('Is Investor:', isInvestor);
    console.log('Should hide Stats:', !isInvestor);
  }, [user, isInvestor]);

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
          activeDeals: 0,
          totalAmount: 0,
        };
      }
    },
    enabled: !isInvestor && !!user, // Тільки для брокерів та коли користувач авторизований
    retry: 1,
    staleTime: 30000, // Дані вважаються актуальними 30 секунд
  });

  // Форматування total amount
  const formatTotalAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Apartment']);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Завантаження properties з API
  const { data: propertiesResponse, isLoading: propertiesLoading, error: propertiesError } = useQuery({
    queryKey: ['home-properties'],
    queryFn: async () => {
      console.log('🔄 Завантаження properties для home...');
      try {
        const response = await propertiesApi.getAll({
          page: 1,
          limit: 10,
          sortBy: 'createdAt',
          sortOrder: 'DESC',
        });
        console.log('✅ Properties завантажено:', response?.data?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження properties:', error);
        console.error('Error details:', error?.response?.data);
        throw error;
      }
    },
    retry: 1,
  });

  // Конвертуємо properties для UI
  const properties = useMemo(() => {
    console.log('📦 Конвертація properties:', {
      hasResponse: !!propertiesResponse,
      hasData: !!propertiesResponse?.data,
      hasProperties: !!propertiesResponse?.data?.data,
      propertiesCount: propertiesResponse?.data?.data?.length || 0,
      error: propertiesError?.message,
    });

    if (!propertiesResponse?.data?.data) {
      console.warn('⚠️ Немає даних для properties');
      return [];
    }
    
    const propertiesList = propertiesResponse.data.data.slice(0, 10);
    console.log('✅ Конвертація:', propertiesList.length, 'properties');
    
    return propertiesList.map((property) => {
      const isOffPlan = property.propertyType === 'off-plan';
      const offPlanProperty = property as OffPlanProperty;
      const secondaryProperty = property as SecondaryProperty;

      // Визначаємо локацію
      let location: string;
      if (isOffPlan) {
        location = offPlanProperty.area || `${offPlanProperty.city.nameEn}`;
      } else {
        const area = typeof secondaryProperty.area === 'object' 
          ? secondaryProperty.area.nameEn 
          : secondaryProperty.area;
        location = `${area}, ${secondaryProperty.city.nameEn}`;
      }

      // Визначаємо ціну (конвертуємо рядки в числа якщо потрібно)
      let price: number;
      if (isOffPlan) {
        price = typeof offPlanProperty.priceFrom === 'string' 
          ? parseFloat(offPlanProperty.priceFrom) || 0
          : (offPlanProperty.priceFrom as number);
      } else {
        price = typeof secondaryProperty.price === 'string'
          ? parseFloat(secondaryProperty.price) || 0
          : (secondaryProperty.price as number);
      }
      const priceFormatted = formatPrice(price, 'USD');

      // Визначаємо зображення з валідацією URI (використовуємо ту саму логіку, що й в property-utils.ts)
      const getValidImageUri = (photos: string[] | undefined): string => {
        if (!photos || !Array.isArray(photos) || photos.length === 0) {
          return 'https://via.placeholder.com/400x300?text=No+Image';
        }
        
        // Фільтруємо та валідуємо фото
        const validPhotos = photos
          .filter((photo): photo is string => typeof photo === 'string' && photo.trim().length > 0)
          .filter(photo => {
            // Перевіряємо, чи це валідний URI
            return photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:') || photo.startsWith('file://');
          });
        
        if (validPhotos.length === 0) {
          return 'https://via.placeholder.com/400x300?text=No+Image';
        }
        
        return validPhotos[0];
      };
      const image = getValidImageUri(property.photos);

      return {
        id: property.id,
        image,
        title: property.name,
        location,
        price: priceFormatted,
        handoverDate: '', // TODO: додати handoverDate якщо є в API
      };
    });
  }, [propertiesResponse]);

  // Завантаження новин з API
  const { data: newsResponse, isLoading: newsLoading } = useQuery({
    queryKey: ['home-news'],
    queryFn: async () => {
      console.log('🔄 Завантаження новин для home...');
      try {
        const response = await newsApi.getPublished({
          page: 1,
          limit: 5,
        });
        console.log('✅ Новини завантажено:', response?.data?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження новин:', error);
        throw error;
      }
    },
    retry: 1,
  });

  // Конвертуємо новини для UI
  const news = useMemo(() => {
    if (!newsResponse?.data?.data) {
      return [];
    }
    
    return newsResponse.data.data.map((newsItem) => {
      // Форматуємо дату
      const formatTimestamp = (dateString: string | null) => {
        if (!dateString) return 'Recently';
        
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
        timestamp: formatTimestamp(newsItem.publishedAt),
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

  // Конвертуємо курси в формат для UI (обмежуємо до 5)
  const knowledgeBaseModules = useMemo(() => {
    if (!coursesResponse?.data) {
      return [];
    }
    
    return coursesResponse.data.slice(0, 5).map((course) => {
      return {
        id: course.id,
        title: course.title,
        author: 'Made by ForYou Real Estate',
        completion: 0, // TODO: додати відстеження прогресу
        status: 'in-progress' as const,
        topicId: 'all', // TODO: додати категорії
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
    cacheTime: 0, // Не кешуємо дані
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
    
    // Сортуємо: спочатку пріоритетні, потім решта
    const sortedDevelopers = [...developersResponse.data].sort((a, b) => {
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
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
    setCurrentSlide(slideIndex);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header 
          title={t('home.dashboard')}
          avatar="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
        />
        
        <View style={styles.searchSection}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <PropertyTypeFilter 
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />
        </View>
        
        {/* Stats Section - Only for Broker */}
        {!isInvestor && (
          <View style={styles.statsSection}>
            <StatsCard
              title={t('home.newLeads')}
              value={crmStatsLoading ? '...' : (crmStats?.newLeads?.toString() || '0')}
              buttonText={t('home.explore')}
              onPress={() => router.push('/(tabs)/crm')}
            />
            
            <View style={styles.smallStatsRow}>
              <SmallStatCard
                icon="briefcase-outline"
                title={t('home.activeDeals')}
                value={crmStatsLoading ? '...' : (crmStats?.activeDeals?.toString() || '0')}
              />
              <SmallStatCard
                icon="cash-outline"
                title={t('home.totalAmount')}
                value={crmStatsLoading ? '...' : formatTotalAmount(crmStats?.totalAmount || 0)}
              />
            </View>
          </View>
        )}
        
        <View style={styles.collectionSection}>
          <CollectionCard
            icon="thumbs-up"
            title={t('home.yourLikedProjects')}
            description={t('home.collectionDescription')}
            gradientImage={require('@/assets/images/gradient-2.png')}
            onPress={() => console.log('Collection pressed 1')}
          />
        </View>
        
        {/* Quick Actions */}
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
            icon="layers"
            label={t('home.collections')}
            onPress={() => console.log('Collections pressed')}
          />
        </View>
        
        <View style={styles.propertySection}>
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
              data={properties}
              renderItem={({ item }) => (
                <View style={{ width: CARD_WIDTH }}>
                  <PropertyCard
                    image={item.image}
                    title={item.title}
                    location={item.location}
                    price={item.price}
                    handoverDate={item.handoverDate}
                    onPress={() => router.push(`/property/${item.id}`)}
                  />
                </View>
              )}
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
            <PaginationDots total={properties.length} current={currentSlide} />
          </View>
        </View>
        
        {/* Developers Section */}
        <View style={styles.developersSection}>
          <View style={styles.developersHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Developers</Text>
            <Pressable onPress={() => router.push('/developers')}>
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
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
            news.map((item) => (
              <NewsCard
                key={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                timestamp={item.timestamp}
                onPress={() => router.push(`/news/${item.slug}`)}
              />
            ))
          )}
        </View>

        {/* Knowledge Base Section */}
        <View style={styles.knowledgeBaseSection}>
          <View style={styles.knowledgeBaseHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.knowledgeBase')}</Text>
            <Pressable onPress={() => router.push('/profile/knowledge-base')}>
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
                onPress={() => router.push(`/profile/module/${module.id}`)}
              >
                <View style={styles.knowledgeModuleContent}>
                  <Text style={[styles.knowledgeModuleTitle, { color: theme.text }]} numberOfLines={2}>
                    {module.title}
                  </Text>
                  <View style={[
                    styles.knowledgeStatusBadge,
                    { backgroundColor: module.status === 'completed' ? '#4CAF50' : '#FF9800' }
                  ]}>
                    <Text style={styles.knowledgeStatusBadgeText}>
                      {module.status === 'completed' ? 'Completed' : 'In Progress'}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor applied dynamically via theme
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 0,
    gap: 12,
  },
  smallStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  propertySection: {
    paddingTop: 24,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  dotsContainer: {
    alignItems: 'center',
  },
  collectionSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
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
    gap: 8,
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
    gap: 8,
  },
  knowledgeBaseSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  knowledgeStatusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
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
});

