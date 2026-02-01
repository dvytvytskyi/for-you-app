import { View, Text, StyleSheet, FlatList, Image, Dimensions, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/api/properties';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useAuthStore } from '@/store/authStore';
import { convertPropertyToCard, PropertyCardData, formatPrice } from '@/utils/property-utils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32;

export default function LikedScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Favorites store
  const { favoriteIds, toggleFavorite: toggleFavoriteInStore } = useFavoritesStore();

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
      const uniquePropertiesMap = new Map();
      properties.forEach((prop: any) => {
        if (prop && prop.id) {
          uniquePropertiesMap.set(prop.id, prop);
        }
      });
      const uniqueProperties = Array.from(uniquePropertiesMap.values());

      return {
        properties: uniqueProperties.map(prop => convertPropertyToCard(prop, favoriteIds)),
        total: uniqueProperties.length
      };
    },
    enabled: favoriteIds.length > 0,
    staleTime: 0,
    gcTime: 0,
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

  const navigation = useNavigation();

  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: theme.border, marginHorizontal: -16, marginBottom: 16 }]}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.6 : 1 }
        ]}
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/(tabs)/home');
          }
        }}
      >
        <Ionicons name="chevron-back" size={24} color={theme.primary} />
      </Pressable>

      <Text style={[styles.headerTitle, { color: theme.text }]}>Liked</Text>

      <View style={styles.backButton} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
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
          data={properties}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          scrollEnabled={true}
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
  theme: any;
  t: any;
  router: any;
}

function PropertyCard({ property, onToggleFavorite, theme, t, router }: PropertyCardProps) {
  const { isFavorite: isFavoriteInStore } = useFavoritesStore();

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
  const isFavorite = isFavoriteInStore(property.id);

  const bedroomsLabel = typeof property.bedrooms === 'string'
    ? property.bedrooms
    : property.bedrooms === 1
      ? t('properties.bedroom')
      : `${property.bedrooms} ${t('properties.bedrooms')}`;

  return (
    <View style={styles.propertyCard}>
      <Pressable onPress={() => router.push(`/property/${property.id}`)} style={StyleSheet.absoluteFill}>
        <Image
          source={{ uri: images[0] }}
          style={styles.propertyImage}
          resizeMode="cover"
        />
      </Pressable>

      {/* Top Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.4)', 'transparent']}
        style={styles.topGradient}
        pointerEvents="none"
      />

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
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    paddingBottom: 13,
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
    paddingRight: 56,
    flexShrink: 1,
    marginBottom: 0,
    alignSelf: 'flex-start',
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
    width: CARD_WIDTH - 32 - 56,
    gap: 2,
  },
  propertyPrice: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
    fontWeight: '600',
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
});
