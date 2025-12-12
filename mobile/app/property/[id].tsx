import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Modal, Animated, ActivityIndicator } from 'react-native';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import MapView from '@/components/ui/MapView';
import { propertiesApi, Property, OffPlanProperty, SecondaryProperty } from '@/api/properties';
import { formatPrice } from '@/utils/property-utils';
import { useFavoritesStore } from '@/store/favoritesStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id, fromCollection } = useLocalSearchParams();
  const isFromCollection = Boolean(fromCollection);
  
  // Завантаження property з API
  const { data: propertyResponse, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id || typeof id !== 'string') {
        throw new Error('Property ID is required');
      }
      console.log('🔄 Завантаження property за ID:', id);
      const response = await propertiesApi.getById(id);
      console.log('✅ Property завантажено:', response?.data?.name);
      console.log('📋 Full API Response:', JSON.stringify(response, null, 2).substring(0, 3000));
      return response;
    },
    enabled: !!id && typeof id === 'string',
    retry: 1,
  });
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  
  // Favorites store
  const { isFavorite, toggleFavorite: toggleFavoriteInStore } = useFavoritesStore();
  const propertyId = typeof id === 'string' ? id : null;
  const isFavoriteProperty = propertyId ? isFavorite(propertyId) : false;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const closeMenu = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
    });
  }, [backdropOpacity, slideAnim]);

  useEffect(() => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 120,
        }),
      ]).start();
    }
  }, [menuVisible]);

  // Конвертація property з API в формат для UI
  const property = useMemo(() => {
    if (!propertyResponse?.data) return null;

    const apiProperty = propertyResponse.data;
    if (!apiProperty) return null;
    
    const isOffPlan = apiProperty.propertyType === 'off-plan';
    const offPlan = isOffPlan ? (apiProperty as OffPlanProperty) : null;
    const secondary = !isOffPlan ? (apiProperty as SecondaryProperty) : null;
    
    console.log('📦 API Property Full:', JSON.stringify(apiProperty, null, 2).substring(0, 2000));
    console.log('📦 API Property Summary:', {
      id: apiProperty.id,
      name: apiProperty.name,
      propertyType: apiProperty.propertyType,
      isOffPlan,
      hasFacilities: !!(apiProperty as any).facilities || !!(apiProperty as any).amenities,
      facilitiesCount: (apiProperty as any).facilities?.length || (apiProperty as any).amenities?.length || 0,
      hasUnits: !!(apiProperty as any).units || !!(apiProperty as any).propertyUnits || !!(offPlan as any)?.units,
      unitsCount: (apiProperty as any).units?.length || (apiProperty as any).propertyUnits?.length || (offPlan as any)?.units?.length || 0,
      offPlanUnits: (offPlan as any)?.units?.length || 0,
      directUnits: (apiProperty as any).units?.length || 0,
      propertyUnits: (apiProperty as any).propertyUnits?.length || 0,
    });
    
    console.log('🔍 Property type check:', {
      propertyType: apiProperty.propertyType,
      isOffPlan,
      hasOffPlanUnits: !!(offPlan as any)?.units,
      offPlanKeys: offPlan ? Object.keys(offPlan) : [],
    });

    // Обробка ціни
    let price: number;
    let priceFormatted: string;
    if (isOffPlan && offPlan) {
      price = typeof offPlan.priceFrom === 'string' 
        ? parseFloat(offPlan.priceFrom) || 0
        : (offPlan.priceFrom as number);
      priceFormatted = formatPrice(price, 'USD');
    } else if (secondary) {
      price = typeof secondary.price === 'string'
        ? parseFloat(secondary.price) || 0
        : secondary.price;
      priceFormatted = formatPrice(price, 'USD');
    } else {
      price = 0;
      priceFormatted = formatPrice(0, 'USD');
    }

    // Обробка локації
    let location: string;
    if (isOffPlan && offPlan) {
      // Для off-plan area може бути рядком або об'єктом
      let areaStr: string;
      if (typeof offPlan.area === 'string') {
        areaStr = offPlan.area;
      } else if (typeof offPlan.area === 'object' && offPlan.area && 'nameEn' in offPlan.area) {
        // Якщо area - об'єкт, витягуємо nameEn
        areaStr = `${(offPlan.area as any).nameEn}, ${offPlan.city?.nameEn || ''}`;
      } else {
        areaStr = offPlan.city?.nameEn || '';
      }
      location = areaStr;
    } else if (secondary) {
      // Для secondary area - це об'єкт
      const area = typeof secondary.area === 'object' && secondary.area
        ? secondary.area.nameEn 
        : String(secondary.area || '');
      location = area ? `${area}, ${secondary.city?.nameEn || ''}` : secondary.city?.nameEn || '';
    } else {
      location = '';
    }
    
    // Переконуємося, що location - це завжди рядок
    location = String(location || '');
    console.log('📍 Location string:', location, 'Type:', typeof location);

    // Обробка координат
    const latitude = typeof apiProperty.latitude === 'string'
      ? parseFloat(apiProperty.latitude) || 0
      : apiProperty.latitude;
    const longitude = typeof apiProperty.longitude === 'string'
      ? parseFloat(apiProperty.longitude) || 0
      : apiProperty.longitude;

    // Обробка спалень та ванних
    let bedrooms: number | string = 0;
    let bathrooms: number | string = 0;
    let size: number = 0;
    let sizeUnit: string = 'sq ft';
    
    if (isOffPlan && offPlan) {
      // Для off-plan показуємо діапазон "1 - 3"
      if (offPlan.bedroomsFrom === offPlan.bedroomsTo) {
        bedrooms = offPlan.bedroomsFrom || 0;
      } else {
        bedrooms = `${offPlan.bedroomsFrom || 0} - ${offPlan.bedroomsTo || 0}`;
      }
      
      if (offPlan.bathroomsFrom === offPlan.bathroomsTo) {
        bathrooms = offPlan.bathroomsFrom || 0;
      } else {
        bathrooms = `${offPlan.bathroomsFrom || 0} - ${offPlan.bathroomsTo || 0}`;
      }
      
      const sizeFrom = typeof offPlan.sizeFrom === 'string'
        ? parseFloat(offPlan.sizeFrom) || 0
        : (offPlan.sizeFrom as number) || 0;
      size = Math.round(offPlan.sizeFromSqft || (sizeFrom * 10.764));
    } else if (secondary) {
      bedrooms = secondary.bedrooms || 0;
      bathrooms = secondary.bathrooms || 0;
      size = Math.round(secondary.sizeSqft || ((secondary.size || 0) * 10.764));
    }

    // Конвертація facilities - перевіряємо різні можливі поля
    let facilities = [];
    if (apiProperty.facilities && Array.isArray(apiProperty.facilities) && apiProperty.facilities.length > 0) {
      facilities = apiProperty.facilities.map((facility: any) => ({
        id: facility.id || String(Math.random()),
        name: facility.nameEn || facility.nameRu || facility.nameAr || facility.name || 'Facility',
        icon: facility.iconName || facility.icon || 'square-outline',
      }));
    } else if ((apiProperty as any).amenities && Array.isArray((apiProperty as any).amenities)) {
      // Якщо facilities немає, але є amenities
      facilities = (apiProperty as any).amenities.map((amenity: any) => ({
        id: amenity.id || amenity.amenityId || String(Math.random()),
        name: amenity.nameEn || amenity.nameRu || amenity.nameAr || amenity.name || amenity.amenityType || 'Facility',
        icon: amenity.iconName || amenity.icon || 'home',
      }));
    }
    console.log('🏢 Facilities processed:', {
      count: facilities.length,
      facilities: facilities,
      rawFacilities: (apiProperty as any).facilities,
      rawAmenities: (apiProperty as any).amenities,
    });

    // Конвертація units для off-plan - згідно з API schema
    // Units можуть бути в property або в area
    let availableUnits = [];
    if (isOffPlan && offPlan) {
      // Перевіряємо різні можливі поля для units
      const unitsData = (offPlan as any)?.units 
        || (apiProperty as any)?.units 
        || (apiProperty as any)?.propertyUnits 
        || (areaInfo as any)?.units
        || [];
      
      console.log('🔍 Units data check:', {
        isOffPlan,
        hasOffPlanUnits: !!offPlan.units,
        hasDirectUnits: !!(apiProperty as any).units,
        hasPropertyUnits: !!(apiProperty as any).propertyUnits,
        hasAreaUnits: !!(areaInfo as any)?.units,
        unitsDataLength: Array.isArray(unitsData) ? unitsData.length : 0,
        unitsDataSample: Array.isArray(unitsData) && unitsData.length > 0 ? unitsData[0] : null,
      });
      
      if (Array.isArray(unitsData) && unitsData.length > 0) {
        availableUnits = unitsData.map((unit: any) => {
          // Обробка ціни згідно з API schema
          // Public API має priceAED, Properties API - тільки price (USD)
          const unitPrice = typeof unit.price === 'string' 
            ? parseFloat(unit.price) 
            : (unit.price as number) || 0;
          
          // Якщо є priceAED (з Public API) - використовуємо його, інакше конвертуємо
          const priceAED = unit.priceAED || (unitPrice * 3.673);
          
          // Обробка розміру згідно з API schema
          // totalSize в м² (оригінальне значення)
          const totalSize = typeof unit.totalSize === 'string'
            ? parseFloat(unit.totalSize)
            : (unit.totalSize as number) || 0;
          
          // balconySize в м² (nullable)
          const balconySize = unit.balconySize 
            ? (typeof unit.balconySize === 'string'
              ? parseFloat(unit.balconySize)
              : unit.balconySize)
            : null;
          
          // Обробка типу згідно з API schema
          const unitType = (unit.type || 'apartment').toLowerCase();
          const typeMap: Record<string, string> = {
            'apartment': 'Apartment',
            'villa': 'Villa',
            'penthouse': 'Penthouse',
            'townhouse': 'Townhouse',
            'office': 'Office',
          };
          
          return {
            id: unit.id || String(Math.random()),
            unitId: unit.unitId || '', // unitId згідно з API schema
            type: typeMap[unitType] || 'Apartment',
            price: formatPrice(priceAED, 'AED'),
            totalSize: Math.round(totalSize * 10) / 10, // Зберігаємо один знак після коми
            balconySize: balconySize ? Math.round(balconySize * 10) / 10 : null,
            planImage: unit.planImage || null, // planImage згідно з API schema
            photos: (unit as any).photos || (unit as any).images || [],
          };
        });
      }
    }
    console.log('🏠 Available Units processed:', {
      count: availableUnits.length,
      units: availableUnits,
      isOffPlan: isOffPlan,
      rawUnits: (offPlan as any)?.units,
      rawPropertyUnits: (apiProperty as any)?.propertyUnits,
      rawUnitsDirect: (apiProperty as any)?.units,
    });

    // Обробка інформації про район (area)
    // Перевіряємо різні можливі місця, де може бути area info
    const areaInfo = (apiProperty as any)?.areaInfo 
      || (isOffPlan && offPlan && typeof offPlan.area === 'object' ? offPlan.area : null)
      || (!isOffPlan && secondary && typeof secondary.area === 'object' ? secondary.area : null)
      || (apiProperty as any)?.area
      || null;
    
    const areaDescription = areaInfo?.description 
      || areaInfo?.descriptionEn 
      || areaInfo?.descriptionRu 
      || areaInfo?.descriptionAr 
      || '';
    const areaPhotos = areaInfo?.photos 
      || areaInfo?.images 
      || areaInfo?.photoUrls 
      || [];
    const areaAmenities = areaInfo?.amenities 
      || areaInfo?.facilities 
      || [];
    
    // Якщо area - це об'єкт з деталями
    let areaDetails = null;
    if (areaInfo && typeof areaInfo === 'object' && !Array.isArray(areaInfo)) {
      areaDetails = {
        id: areaInfo.id || '',
        name: areaInfo.nameEn || areaInfo.nameRu || areaInfo.nameAr || areaInfo.name || location.split(',')[0] || '',
        description: areaDescription,
        photos: Array.isArray(areaPhotos) ? areaPhotos.filter((p: any) => p && typeof p === 'string') : [],
        amenities: Array.isArray(areaAmenities) ? areaAmenities.map((amenity: any) => ({
          id: amenity.id || amenity.amenityId || String(Math.random()),
          name: amenity.nameEn || amenity.nameRu || amenity.nameAr || amenity.name || amenity.amenityType || 'Amenity',
          icon: amenity.iconName || amenity.icon || 'home',
        })) : [],
      };
    }
    
    console.log('📍 Area info processed:', {
      hasAreaInfo: !!areaInfo,
      hasAreaDetails: !!areaDetails,
      areaInfoType: typeof areaInfo,
      areaInfoKeys: areaInfo ? Object.keys(areaInfo) : [],
      areaDescription: areaDescription?.substring(0, 100),
      areaPhotosCount: areaDetails?.photos?.length || 0,
      areaAmenitiesCount: areaDetails?.amenities?.length || 0,
      areaDetails: areaDetails,
    });

    return {
      id: apiProperty.id,
      title: apiProperty.name,
      price: priceFormatted, // Вже містить $ символ
      currency: '', // Не потрібен, бо priceFormatted вже має символ
      location,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      size,
      sizeUnit,
      handoverDate: '', // TODO: додати handoverDate якщо є в API
      images: apiProperty.photos || [],
    description: {
        text: apiProperty.description || '',
      },
      facilities,
      availableUnits,
      developer: isOffPlan && offPlan?.developer ? offPlan.developer.name : null,
      propertyType: apiProperty.propertyType,
      areaDetails, // Додаємо інформацію про район
    };
  }, [propertyResponse]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const toggleFavorite = () => {
    if (propertyId) {
      toggleFavoriteInStore(propertyId);
    }
  };

  // Стан завантаження
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary, marginTop: 16 }]}>
          {t('properties.loading')}
        </Text>
      </View>
    );
  }

  // Стан помилки
  if (error || !property) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
        <Text style={[styles.errorTitle, { color: theme.text, marginTop: 16 }]}>
          {t('properties.errorLoading')}
        </Text>
        <Text style={[styles.errorText, { color: theme.textSecondary, marginTop: 8, textAlign: 'center' }]}>
          {(error as any)?.message || 'Property not found'}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1, marginTop: 20 }
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

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
                {property.images
                  .filter(img => img && typeof img === 'string' && img.trim().length > 0)
                  .filter(img => img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('file://'))
                  .map((image, index) => (
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
                      name={isFavoriteProperty ? "heart" : "heart-outline"} 
                      size={24} 
                      color={isFavoriteProperty ? "#FF3B30" : "#FFFFFF"} 
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
                {property.price}
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
              {property.description.text && (
                <Pressable disabled={!property.description.text || property.description.text.length <= 150}>
                  <Text style={[
                    styles.readMore, 
                    { 
                      color: property.description.text.length > 150 
                        ? theme.primary 
                        : theme.textTertiary 
                    }
                  ]}>
                    Read more
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Area Information - завжди показуємо для тестування */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8 }]}>
                Area Information {property.areaDetails ? `(Found)` : '(Not found)'}
              </Text>
              {property.areaDetails ? (
                <>
                  {/* Area Description */}
                  {property.areaDetails.description && (
                    <>
                      <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8, fontSize: 14 }]}>
                        About {property.areaDetails.name}
                      </Text>
                      <Text style={[styles.newsText, { color: theme.textSecondary }]}>
                        {property.areaDetails.description}
                      </Text>
                    </>
                  )}

                  {/* Area Photos */}
                  {property.areaDetails.photos && property.areaDetails.photos.length > 0 ? (
                    <>
                      <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, marginTop: 16, fontSize: 14 }]}>
                        Area Photos ({property.areaDetails.photos.length})
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.areaPhotosScroll}
                        contentContainerStyle={styles.areaPhotosContent}
                      >
                        {property.areaDetails.photos.map((photo: string, index: number) => (
                          <Image
                            key={index}
                            source={{ uri: photo }}
                            style={styles.areaPhoto}
                            resizeMode="cover"
                          />
                        ))}
                      </ScrollView>
                    </>
                  ) : (
                    <Text style={[styles.newsText, { color: theme.textTertiary, fontStyle: 'italic' }]}>
                      No area photos available
                    </Text>
                  )}

                  {/* Area Amenities */}
                  {property.areaDetails.amenities && property.areaDetails.amenities.length > 0 ? (
                    <>
                      <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, marginTop: 16, fontSize: 14 }]}>
                        Area Amenities ({property.areaDetails.amenities.length})
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.facilitiesScroll}
                        contentContainerStyle={styles.facilitiesContent}
                      >
                        {property.areaDetails.amenities.map((amenity: any) => (
                          <View key={amenity.id} style={styles.facilityItem}>
                            <View style={[styles.facilityIcon, { backgroundColor: theme.card, borderColor: theme.border }]}>
                              <Ionicons 
                                name={(amenity.icon as any) || 'square-outline'} 
                                size={24} 
                                color={theme.primary} 
                              />
                            </View>
                            <Text style={[styles.facilityName, { color: theme.textSecondary }]}>
                              {amenity.name}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </>
                  ) : (
                    <Text style={[styles.newsText, { color: theme.textTertiary, fontStyle: 'italic', marginTop: 16 }]}>
                      No area amenities available
                    </Text>
                  )}
                </>
              ) : (
                <Text style={[styles.newsText, { color: theme.textTertiary, fontStyle: 'italic' }]}>
                  Area information not available in API response. Check console logs for details.
                </Text>
              )}
            </View>

            {/* Facilities */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
                Facilities {property.facilities ? `(${property.facilities.length})` : '(0)'}
              </Text>
              
              {property.facilities && property.facilities.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.facilitiesScroll}
                  contentContainerStyle={styles.facilitiesContent}
                >
                  {property.facilities.map((facility) => (
                    <View key={facility.id} style={styles.facilityItem}>
                      <View style={[styles.facilityIcon, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Ionicons 
                          name={(facility.icon as any) || 'square-outline'} 
                          size={24} 
                          color={theme.primary} 
                        />
                      </View>
                      <Text style={[styles.facilityName, { color: theme.textSecondary }]}>
                        {facility.name}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <Text style={[styles.newsText, { color: theme.textTertiary, fontStyle: 'italic' }]}>
                  No facilities available
                </Text>
              )}
            </View>

            {/* Available Units - тільки для off-plan, після area information */}
            {property.propertyType === 'off-plan' && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
                  Available Units {property.availableUnits ? `(${property.availableUnits.length})` : '(0)'}
                </Text>

                {property.availableUnits && property.availableUnits.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.unitsScroll}
                    contentContainerStyle={styles.unitsContent}
                  >
                    {property.availableUnits.map((unit) => (
                      <View key={unit.id} style={[styles.unitCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        {/* Unit Plan Image */}
                        {unit.planImage && (
                          <Image
                            source={{ uri: unit.planImage }}
                            style={styles.unitImage}
                            resizeMode="cover"
                          />
                        )}
                        
                        <View style={styles.unitInfo}>
                          <Text style={[styles.unitType, { color: theme.text }]}>
                            {unit.type}
                          </Text>
                          {unit.unitId && (
                            <Text style={[styles.unitSize, { color: theme.textSecondary, fontSize: 12, marginBottom: 4 }]}>
                              Unit ID: {unit.unitId}
                            </Text>
                          )}
                          <Text style={[styles.unitPrice, { color: theme.text }]}>
                            {unit.price}
                          </Text>
                          <Text style={[styles.unitSize, { color: theme.textSecondary }]}>
                            Total size: {unit.totalSize} m²
                          </Text>
                          {unit.balconySize && (
                            <Text style={[styles.unitSize, { color: theme.textSecondary }]}>
                              Balcony: {unit.balconySize} m²
                            </Text>
                          )}
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={[styles.newsText, { color: theme.textTertiary, fontStyle: 'italic' }]}>
                    No units available
                  </Text>
                )}
              </View>
            )}

            {/* Developer Banner */}
            {property.developer && (
            <View style={styles.section}>
              <View style={[styles.reportageBanner, { backgroundColor: theme.primary }]}>
                <View style={styles.reportageContent}>
                  <View style={styles.reportageTextContainer}>
                      <Text style={styles.reportageTitle}>{property.developer}</Text>
                      <Text style={styles.reportageSubtitle}>Learn more about developer</Text>
                  </View>
                  <Pressable style={[styles.exploreButton, { backgroundColor: '#FFFFFF' }]}>
                    <Text style={[styles.exploreButtonText, { color: theme.primary }]}>
                      Explore
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            )}

            {/* Location Map */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
                Location
              </Text>
              <View style={styles.mapWrapper}>
                <MapView
                  latitude={property.latitude}
                  longitude={property.longitude}
                  accessToken="pk.eyJ1IjoiYWJpZXNwYW5hIiwiYSI6ImNsb3N4NzllYzAyOWYybWw5ZzNpNXlqaHkifQ.UxlTvUuSq9L5jt0jRtRR-A"
                  styleUrl="mapbox://styles/abiespana/clsq0mcqa00ke01qw8btw21mv"
                  height={200}
                  borderRadius={12}
                />
                <Text style={[styles.mapAddress, { color: theme.textSecondary }]}>
                  Located in {property.location}
                </Text>
              </View>
            </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={[styles.bottomButtonContainer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable
          style={[styles.bottomButton, { backgroundColor: isFromCollection ? '#FF6B5D' : theme.primary }]}
          onPress={() => console.log(isFromCollection ? 'Remove from collection' : 'Add to collection')}
        >
          <Text style={styles.bottomButtonText}>
            {isFromCollection ? 'Remove from collection' : 'Add to collection'}
          </Text>
        </Pressable>
        {!isFromCollection && (
          <Pressable
            style={[styles.menuButton, { borderColor: theme.border }]}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Ionicons name="options-outline" size={24} color={theme.text} />
          </Pressable>
        )}
      </View>

      {/* Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <Animated.View
          style={[
            styles.menuBackdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeMenu}
          />
          <Animated.View
            style={[
              styles.menuContent,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Drag Handle */}
            <View style={styles.dragHandleContainer}>
              <View style={[styles.dragHandle, { backgroundColor: theme.textSecondary }]} />
            </View>
            
            <View style={styles.menuItemsContainer}>
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  console.log('Report property');
                  closeMenu();
                }}
              >
                <Ionicons name="flag-outline" size={20} color={theme.text} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Report property</Text>
              </Pressable>
              <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  console.log('Compare property');
                  closeMenu();
                }}
              >
                <Ionicons name="swap-horizontal-outline" size={20} color={theme.text} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Compare property</Text>
              </Pressable>
              <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
              <Pressable
                style={styles.menuItem}
                onPress={() => {
                  console.log('Like property');
                  closeMenu();
                }}
              >
                <Ionicons name="heart-outline" size={20} color={theme.text} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Like property</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
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
  areaPhotosScroll: {
    marginHorizontal: -16,
  },
  areaPhotosContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  areaPhoto: {
    width: 280,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
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
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  unitImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  unitInfo: {
    padding: 16,
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
  mapWrapper: {
    marginBottom: 0,
  },
  mapAddress: {
    fontSize: 14,
    textAlign: 'left',
    marginTop: 12,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
  },
  bottomButton: {
    flex: 1,
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
  menuButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContent: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  menuItemsContainer: {
    paddingBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuDivider: {
    height: 1,
    width: '100%',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 14,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

