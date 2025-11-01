import { View, Text, StyleSheet, ScrollView, FlatList, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Header, SearchBar } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32;

type PropertyType = 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'studio';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  type: PropertyType;
  images: string[];
  handoverDate: string;
  isFavorite: boolean;
}

// Mock data - liked properties
const LIKED_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Lovely apartment with 2 bedrooms',
    location: 'Downtown Dubai',
    price: 1300000,
    bedrooms: 3,
    type: 'apartment',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260066-6bc35f0a5c1a?w=800',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
    ],
    handoverDate: '25 Mar 2027',
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Modern penthouse with sea view',
    location: 'Dubai Marina',
    price: 3200000,
    bedrooms: 4,
    type: 'penthouse',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
    ],
    handoverDate: '10 Jan 2027',
    isFavorite: true,
  },
  {
    id: '7',
    title: 'Luxury apartment with view',
    location: 'Business Bay',
    price: 2800000,
    bedrooms: 3,
    type: 'apartment',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    handoverDate: '15 Feb 2027',
    isFavorite: true,
  },
];

export default function LikedScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>(LIKED_PROPERTIES);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const toggleFavorite = useCallback((id: string) => {
    setProperties(prev => prev.map(prop => 
      prop.id === id ? { ...prop, isFavorite: !prop.isFavorite } : prop
    ));
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate more properties (in real app, this would be an API call)
    const newProperties: Property[] = [
      {
        id: `${properties.length + 1}`,
        title: 'Luxury villa in JBR',
        location: 'Jumeirah Beach Residence',
        price: 4500000,
        bedrooms: 5,
        type: 'villa',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
        handoverDate: '30 May 2027',
        isFavorite: true,
      },
      {
        id: `${properties.length + 2}`,
        title: 'Studio with balcony',
        location: 'Dubai Marina',
        price: 1200000,
        bedrooms: 1,
        type: 'studio',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        handoverDate: '20 Nov 2026',
        isFavorite: true,
      },
    ];
    
    setProperties(prev => [...prev, ...newProperties]);
    setLoading(false);
    
    // Simulate end of data after 3 loads
    if (properties.length >= 7) {
      setHasMore(false);
    }
  }, [loading, hasMore, properties.length]);

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
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onScrollStart={() => setScrollEnabled(false)}
            onScrollEnd={() => setScrollEnabled(true)}
            theme={theme}
            t={t}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Loading more properties...
              </Text>
            </View>
          ) : !hasMore && filteredProperties.length > 0 ? (
            <View style={styles.endContainer}>
              <Text style={[styles.endText, { color: theme.textTertiary }]}>
                No more properties to load
              </Text>
            </View>
          ) : null
        }
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
    </SafeAreaView>
  );
}

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: () => void;
  onScrollStart: () => void;
  onScrollEnd: () => void;
  theme: any;
  t: any;
}

function PropertyCard({ property, onToggleFavorite, onScrollStart, onScrollEnd, theme, t }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  
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
        {property.images.map((image, index) => (
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
      
      {/* Pagination Dots */}
      {property.images.length > 1 && (
        <View style={styles.paginationContainer} pointerEvents="none">
          {property.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentImageIndex && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      )}
      
      {/* Tags */}
      <View style={styles.tagsContainer} pointerEvents="none">
        <BlurView intensity={20} tint="light" style={styles.tag}>
          <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
            {t(`properties.propertyTypes.${property.type}`)}
          </Text>
        </BlurView>
        <BlurView intensity={20} tint="light" style={styles.tag}>
          <Text style={[styles.tagText, { color: '#FFFFFF' }]}>
            {property.bedrooms} {property.bedrooms === 1 ? t('properties.bedroom') : t('properties.bedrooms')}
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
          <Text style={styles.propertyPrice}>
            {property.price.toLocaleString()}$ • {t('properties.handover')} {property.handoverDate}
          </Text>
        </View>

        {/* Favorite Button */}
        <Pressable
          style={({ pressed }) => [
            styles.favoriteButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onToggleFavorite}
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    height: '60%',
    padding: 16,
    justifyContent: 'flex-end',
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
    gap: 4,
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
  propertyPrice: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
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

