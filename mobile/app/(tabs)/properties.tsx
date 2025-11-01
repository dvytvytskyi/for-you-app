import { View, Text, StyleSheet, ScrollView, FlatList, Pressable, Image, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32; // padding left + right
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { SearchBar } from '@/components/ui';
import PropertyFiltersModal, { PropertyFilters } from '@/components/ui/PropertyFilters';

type PropertyType = 'all' | 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'studio';

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

// Mock data
const MOCK_PROPERTIES: Property[] = [
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
    isFavorite: false,
  },
  {
    id: '2',
    title: 'Luxury villa with pool',
    location: 'Palm Jumeirah',
    price: 5800000,
    bedrooms: 5,
    type: 'villa',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
    ],
    handoverDate: '15 Dec 2026',
    isFavorite: false,
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
    id: '4',
    title: 'Spacious townhouse in community',
    location: 'Arabian Ranches',
    price: 2100000,
    bedrooms: 4,
    type: 'townhouse',
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    handoverDate: '20 Aug 2027',
    isFavorite: false,
  },
  {
    id: '5',
    title: 'Cozy studio apartment',
    location: 'Business Bay',
    price: 850000,
    bedrooms: 1,
    type: 'studio',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    handoverDate: '05 Nov 2026',
    isFavorite: false,
  },
  {
    id: '6',
    title: 'Elegant villa with garden',
    location: 'Emirates Hills',
    price: 7200000,
    bedrooms: 6,
    type: 'villa',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    handoverDate: '15 Feb 2027',
    isFavorite: false,
  },
  {
    id: '7',
    title: 'Contemporary apartment',
    location: 'Jumeirah Lake Towers',
    price: 1450000,
    bedrooms: 2,
    type: 'apartment',
    images: ['https://images.unsplash.com/photo-1502672260066-6bc35f0a5c1a?w=800'],
    handoverDate: '30 Apr 2027',
    isFavorite: true,
  },
  {
    id: '8',
    title: 'Sky-high penthouse',
    location: 'Business Bay',
    price: 4800000,
    bedrooms: 5,
    type: 'penthouse',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    handoverDate: '12 Jun 2027',
    isFavorite: false,
  },
  {
    id: '9',
    title: 'Family townhouse',
    location: 'Dubai Hills Estate',
    price: 2350000,
    bedrooms: 3,
    type: 'townhouse',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
    handoverDate: '08 Sep 2027',
    isFavorite: false,
  },
  {
    id: '10',
    title: 'Modern studio with balcony',
    location: 'Dubai Marina',
    price: 920000,
    bedrooms: 1,
    type: 'studio',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    handoverDate: '25 Oct 2026',
    isFavorite: false,
  },
  {
    id: '11',
    title: 'Bright apartment with city view',
    location: 'Sheikh Zayed Road',
    price: 1680000,
    bedrooms: 3,
    type: 'apartment',
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
    handoverDate: '18 Dec 2026',
    isFavorite: false,
  },
  {
    id: '12',
    title: 'Beachfront villa',
    location: 'Jumeirah Beach',
    price: 9500000,
    bedrooms: 7,
    type: 'villa',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    handoverDate: '03 May 2027',
    isFavorite: true,
  },
  {
    id: '13',
    title: 'Chic penthouse loft',
    location: 'DIFC',
    price: 5200000,
    bedrooms: 4,
    type: 'penthouse',
    images: ['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800'],
    handoverDate: '22 Jul 2027',
    isFavorite: false,
  },
  {
    id: '14',
    title: 'Corner townhouse',
    location: 'Reem',
    price: 1950000,
    bedrooms: 3,
    type: 'townhouse',
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'],
    handoverDate: '14 Nov 2026',
    isFavorite: false,
  },
  {
    id: '15',
    title: 'Minimalist studio',
    location: 'Downtown Dubai',
    price: 780000,
    bedrooms: 1,
    type: 'studio',
    images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'],
    handoverDate: '06 Jan 2027',
    isFavorite: false,
  },
  {
    id: '16',
    title: 'Spacious 3BR apartment',
    location: 'Dubai Creek Harbour',
    price: 1820000,
    bedrooms: 3,
    type: 'apartment',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    handoverDate: '19 Mar 2027',
    isFavorite: false,
  },
  {
    id: '17',
    title: 'Mediterranean villa',
    location: 'The Villa',
    price: 6800000,
    bedrooms: 5,
    type: 'villa',
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'],
    handoverDate: '11 Aug 2027',
    isFavorite: true,
  },
  {
    id: '18',
    title: 'Luxurious penthouse suite',
    location: 'Palm Jumeirah',
    price: 8900000,
    bedrooms: 6,
    type: 'penthouse',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
    handoverDate: '27 Sep 2027',
    isFavorite: false,
  },
];

export default function PropertiesScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(['all']);
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  const propertyTypes: PropertyType[] = ['all', 'apartment', 'villa', 'penthouse', 'townhouse'];

  const toggleFavorite = (id: string) => {
    setProperties(prev =>
      prev.map(p => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const toggleType = (type: PropertyType) => {
    if (type === 'all') {
      setSelectedTypes(['all']);
    } else {
      setSelectedTypes(prev => {
        // Remove 'all' if it was selected
        const withoutAll = prev.filter(t => t !== 'all');
        
        // Toggle the selected type
        if (prev.includes(type)) {
          const newTypes = withoutAll.filter(t => t !== type);
          // If no types selected, default to 'all'
          return newTypes.length === 0 ? ['all'] : newTypes;
        } else {
          return [...withoutAll, type];
        }
      });
    }
  };

  const handleApplyFilters = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    // Here you would typically filter properties based on the new filters
    // For now, we'll just close the modal
  };

  const filteredProperties = properties.filter(property => {
    const matchesType = selectedTypes.includes('all') || selectedTypes.includes(property.type);
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
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
        title: 'Spacious townhouse in community',
        location: 'Arabian Ranches',
        price: 2100000,
        bedrooms: 4,
        type: 'townhouse',
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
        handoverDate: '20 Aug 2027',
        isFavorite: false,
      },
      {
        id: `${properties.length + 2}`,
        title: 'Cozy studio apartment',
        location: 'Business Bay',
        price: 850000,
        bedrooms: 1,
        type: 'studio',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        handoverDate: '05 Nov 2026',
        isFavorite: false,
      },
    ];
    
    setProperties(prev => [...prev, ...newProperties]);
    setLoading(false);
    
    // Simulate end of data after 3 loads (24 items total: 18 initial + 6 more)
    if (properties.length >= 22) {
      setHasMore(false);
    }
  }, [loading, hasMore, properties.length]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('properties.searchPlaceholder')}
        />
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

      {/* Property Type Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersContainer}
        >
        {propertyTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <Pressable
              key={type}
              style={({ pressed }) => [
                styles.filterChip,
                {
                  backgroundColor: isSelected ? theme.primary : theme.card,
                  borderColor: isSelected ? theme.primary : theme.border,
                  opacity: pressed ? 0.8 : 1,
                }
              ]}
              onPress={() => toggleType(type)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isSelected ? '#FFFFFF' : theme.text }
                ]}
                numberOfLines={1}
              >
                {t(`properties.propertyTypes.${type}`)}
              </Text>
            </Pressable>
          );
        })}
        </ScrollView>
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
    alignItems: 'center',
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  filtersWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  filtersContainer: {
    maxHeight: 48,
  },
  filtersContent: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    textAlignVertical: 'center',
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

