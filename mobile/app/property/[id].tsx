import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock data
  const property = {
    id: '1',
    title: 'Lovely apartment with 2 bedrooms',
    price: '249 932',
    currency: '$',
    location: 'Dubai land Islands, Dubai, UAE',
    bedrooms: 3,
    bathrooms: 2,
    size: 2660,
    sizeUnit: 'sq ft',
    handoverDate: '25 Mar 2027',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1502672260066-6bc35f0a5c1a?w=800',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    description: {
      text: 'Brabus Island Chapter Two - The Villas is a project designed for those who demand uncompromising luxury and individuality. Here, the world-renowned brand has translated its vision into an exclusive residential development that redefines waterfront living.',
    },
    facilities: [
      { id: '1', name: 'Internet', icon: 'wifi-outline' },
      { id: '2', name: 'Parking', icon: 'car-outline' },
      { id: '3', name: 'Gym', icon: 'fitness-outline' },
      { id: '4', name: 'Pool', icon: 'water-outline' },
      { id: '5', name: 'Security', icon: 'shield-checkmark-outline' },
      { id: '6', name: 'Elevator', icon: 'arrow-up-circle-outline' },
    ],
    availableUnits: [
      {
        id: '1',
        type: 'Apartment',
        price: '615 850 AED',
        totalSize: 33.2,
        balconySize: 6,
        floorPlan: {
          balcony: { width: 3.40, height: 1.50 },
          bedroom: { width: 4.20, height: 3.00 },
          sitting: { width: 4.20, height: 2.90 },
          kitchen: { width: 1.90, height: 3.30 },
          toilet: { width: 1.60, height: 2.60 },
        },
      },
      {
        id: '2',
        type: 'Apartment',
        price: '725 000 AED',
        totalSize: 42.5,
        balconySize: 8,
        floorPlan: {
          balcony: { width: 4.20, height: 1.80 },
          bedroom: { width: 5.00, height: 3.50 },
          sitting: { width: 5.00, height: 3.20 },
          kitchen: { width: 2.20, height: 3.80 },
          toilet: { width: 1.80, height: 2.80 },
        },
      },
      {
        id: '3',
        type: 'Apartment',
        price: '895 000 AED',
        totalSize: 55.0,
        balconySize: 10,
        floorPlan: {
          balcony: { width: 5.00, height: 2.00 },
          bedroom: { width: 5.50, height: 4.00 },
          sitting: { width: 6.00, height: 3.50 },
          kitchen: { width: 2.50, height: 4.00 },
          toilet: { width: 2.00, height: 3.00 },
        },
      },
    ],
    developer: 'BRABUS',
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style="light" />
      {/* Property Details */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {property.images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.image}
                  />
                ))}
              </ScrollView>

              {/* Top Gradient */}
              <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent']}
                style={styles.topGradient}
                pointerEvents="none"
              />

              {/* Navigation Buttons */}
              <View style={[styles.navButtons, { top: insets.top + 8 }]} pointerEvents="box-none">
                <Pressable
                  onPress={() => router.back()}
                  style={styles.navButton}
                >
                  <BlurView intensity={20} tint="light" style={styles.blurButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </BlurView>
                </Pressable>
                
                <Pressable
                  onPress={toggleFavorite}
                  style={styles.navButton}
                >
                  <BlurView intensity={20} tint="light" style={styles.blurButton}>
                    <Ionicons 
                      name={isFavorite ? "heart" : "heart-outline"} 
                      size={24} 
                      color={isFavorite ? "#FF3B30" : "#FFFFFF"} 
                    />
                  </BlurView>
                </Pressable>
              </View>

              {/* Pagination Dots */}
              <View style={styles.pagination} pointerEvents="none">
                {property.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
        <View style={[styles.content, { backgroundColor: theme.background }]}>
            {/* Title and Price */}
            <View style={styles.titleRow}>
              <Text 
                style={[styles.title, { color: theme.text }]} 
                numberOfLines={2}
              >
                {property.title}
              </Text>
              <Text style={[styles.price, { color: '#FF6B35' }]}>
                {property.currency} {property.price}
              </Text>
            </View>

            {/* Location */}
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              {property.location}
            </Text>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="bed" size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {property.bedrooms}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  bedrooms
                </Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="water-outline" size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {property.bathrooms}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  bathrooms
                </Text>
              </View>

              <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Ionicons name="move" size={20} color={theme.primary} />
                <Text style={[styles.statValue, { color: theme.text }]}>
                  {property.size}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {property.sizeUnit}
                </Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8 }]}>
                Description
              </Text>
              <Text style={[styles.newsText, { color: theme.textSecondary }]}>
                {property.description.text}
              </Text>
              <Pressable>
                <Text style={[styles.readMore, { color: theme.primary }]}>
                  Read more
                </Text>
              </Pressable>
            </View>

            {/* Facilities */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
                Facilities
              </Text>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.facilitiesScroll}
                contentContainerStyle={styles.facilitiesContent}
              >
                {property.facilities.map((facility) => (
                  <View key={facility.id} style={styles.facilityItem}>
                    <View style={[styles.facilityIcon, { backgroundColor: theme.card, borderColor: theme.border }]}>
                      <Ionicons name={facility.icon as any} size={24} color={theme.primary} />
                    </View>
                    <Text style={[styles.facilityName, { color: theme.textSecondary }]}>
                      {facility.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Available Units */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
                Available units
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.unitsScroll}
                contentContainerStyle={styles.unitsContent}
              >
                {property.availableUnits.map((unit) => (
                  <View key={unit.id} style={[styles.unitCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.unitType, { color: theme.text }]}>
                      {unit.type}
                    </Text>
                    <Text style={[styles.unitPrice, { color: theme.text }]}>
                      {unit.price}
                    </Text>
                    <Text style={[styles.unitSize, { color: theme.textSecondary }]}>
                      Total size: {unit.totalSize} m²
                    </Text>
                    <Text style={[styles.unitSize, { color: theme.textSecondary }]}>
                      Balcony: {unit.balconySize} m²
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Reportage Banner */}
            <View style={styles.section}>
              <View style={[styles.reportageBanner, { backgroundColor: theme.primary }]}>
                <View style={styles.reportageContent}>
                  <View style={styles.reportageTextContainer}>
                    <Text style={styles.reportageTitle}>Reportage</Text>
                    <Text style={styles.reportageSubtitle}>Developer of this building</Text>
                  </View>
                  <Pressable style={[styles.exploreButton, { backgroundColor: '#FFFFFF' }]}>
                    <Text style={[styles.exploreButtonText, { color: theme.primary }]}>
                      Explore
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Location Map */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Location
              </Text>
              <View style={[styles.mapContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800' }}
                  style={styles.mapImage}
                />
                <View style={styles.mapPin}>
                  <Text style={styles.mapPinText}>Fy</Text>
                </View>
              </View>
              <Text style={[styles.mapAddress, { color: theme.textSecondary }]}>
                Located in {property.location}
              </Text>
            </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={[styles.bottomButtonContainer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable
          style={[styles.bottomButton, { backgroundColor: theme.primary }]}
          onPress={() => console.log('Add to collection')}
        >
          <Text style={styles.bottomButtonText}>
            Add to collection
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    resizeMode: 'cover',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    zIndex: 1,
  },
  navButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  blurButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    zIndex: 2,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  paginationDotActive: {
    width: 18,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingTop: 18,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  newsText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  facilitiesScroll: {
    marginHorizontal: -16,
  },
  facilitiesContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  facilityItem: {
    alignItems: 'center',
  },
  facilityIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  facilityName: {
    fontSize: 12,
    textAlign: 'center',
  },
  unitsScroll: {
    marginHorizontal: -16,
  },
  unitsContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  unitCard: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  unitType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  unitPrice: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  unitSize: {
    fontSize: 13,
    marginBottom: 4,
  },
  reportageBanner: {
    borderRadius: 16,
    padding: 20,
  },
  reportageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportageTextContainer: {
    flex: 1,
  },
  reportageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reportageSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  exploreButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  exploreButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapPin: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -15,
    marginTop: -25,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#102F73',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  mapAddress: {
    fontSize: 14,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  bottomButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
});

