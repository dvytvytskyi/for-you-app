import { View, Text, StyleSheet, ScrollView, FlatList, Image, Dimensions, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header, SearchBar } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/api/properties';
import { useFavoritesStore } from '@/store/favoritesStore';
import { convertPropertyToCard, PropertyCardData, formatPrice } from '@/utils/property-utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32;

export default function LikedScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  // Favorites store
  const { favoriteIds, toggleFavorite: toggleFavoriteInStore, isFavorite } = useFavoritesStore();
  
  // Завантаження улюблених properties з API
  const { data: propertiesData, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['favorite-properties', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) {
        return { properties: [], total: 0 };
      }
      
      console.log('🔄 Завантаження улюблених properties:', favoriteIds.length);
      
      // Завантажуємо кожен property за ID
      const propertiesPromises = favoriteIds.map(id => 
        propertiesApi.getById(id).catch(err => {
          console.warn(`⚠️ Не вдалося завантажити property ${id}:`, err);
          return null;
        })
      );
      
      const results = await Promise.all(propertiesPromises);
      const properties = results
        .filter((result): result is { success: boolean; data: any } => 
          result !== null && 
          result !== undefined && 
          result.success && 
          result.data !== null && 
          result.data !== undefined
        )
        .map(result => result.data)
        .filter(prop => prop && prop.id); // Додаткова перевірка на наявність id
      
      console.log('✅ Завантажено улюблених properties:', properties.length);
      
      // Видаляємо дубльовані properties за ID
      const uniqueProperties = Array.from(
        new Map(properties.map(prop => [prop.id, prop]).filter(([id]) => id)).values()
      );
      
      return { 
        properties: uniqueProperties.map(prop => convertPropertyToCard(prop)),
        total: uniqueProperties.length 
      };
    },
    enabled: favoriteIds.length > 0,
    staleTime: 0,
    cacheTime: 0,
  });

  const properties = useMemo(() => {
    return propertiesData?.properties || [];
  }, [propertiesData]);

  const toggleFavorite = useCallback((id: string) => {
    toggleFavoriteInStore(id);
  }, [toggleFavoriteInStore]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const filteredProperties = useMemo(() => {
    // Видаляємо дубльовані properties за ID перед фільтрацією
    const uniqueProperties = Array.from(
      new Map(properties.map(prop => [prop.id, prop])).values()
    );
    
    const filtered = uniqueProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
    
    // Додаємо isFavorite для кожного property
    return filtered.map(prop => ({
      ...prop,
      isFavorite: true, // Всі properties в liked page є улюбленими
    }));
  }, [properties, searchQuery]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header and Search */}
      <View>
        <Header 
          title={t('tabs.liked.title')}
          avatar="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
        />
        
        <View style={styles.searchSection}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('properties.searchPlaceholder')}
          />
        </View>
      </View>

      {/* Properties List */}
      {isLoading ? (
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
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={64} color={theme.textTertiary} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {t('tabs.liked.noLikedProperties')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                {t('tabs.liked.startExploring')}
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
  const { isFavorite: isFavoriteInStore } = useFavoritesStore();
  
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
  
  const isFavorite = isFavoriteInStore(property.id);
  
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
                key={`${property.id}-dot-${displayIndex}`}
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
            {typeof property.bedrooms === 'string'
              ? property.bedrooms
              : property.bedrooms === 1
              ? t('properties.bedroom')
              : `${property.bedrooms} ${t('properties.bedrooms')}`}
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
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF3B30' : '#FFFFFF'}
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
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
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
});

