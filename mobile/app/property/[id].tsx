import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Modal, Animated, ActivityIndicator, Linking } from 'react-native';
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
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useAuthStore } from '@/store/authStore';
import { chatApi } from '@/api/chat';
import { MessageType } from '@/types/chat';
import SelectCollectionModal from '@/components/ui/SelectCollectionModal';

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
  const { isFavorite, toggleFavorite: toggleFavoriteInStore, favoriteIds } = useFavoritesStore();
  const propertyId = typeof id === 'string' ? id : null;
  const isFavoriteProperty = propertyId ? isFavorite(propertyId) : false;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Presentation State
  const { user } = useAuthStore();
  const [presentationModalVisible, setPresentationModalVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingToChat, setIsSendingToChat] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const presentationSlideAnim = useRef(new Animated.Value(0)).current;
  const presentationBackdropOpacity = useRef(new Animated.Value(0)).current;

  // Collection Selection state
  const [selectCollectionVisible, setSelectCollectionVisible] = useState(false);

  // Presentation Modal Animation
  useEffect(() => {
    if (presentationModalVisible) {
      Animated.parallel([
        Animated.timing(presentationBackdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(presentationSlideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 120,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(presentationBackdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(presentationSlideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [presentationModalVisible]);

  const handleGeneratePresentation = async () => {
    try {
      setIsGenerating(true);
      setLoadingStatus('Preparing presentation data...');

      // Base URL configuration - using hardcoded for now as per api/public-api-client.ts
      const baseUrl = 'https://admin.foryou-realestate.com/api/v1';
      let url = `${baseUrl}/properties/${id}/presentation`;

      if (user) {
        const params = new URLSearchParams();
        if (user.firstName || user.lastName) {
          params.append('agentName', `${user.firstName || ''} ${user.lastName || ''}`.trim());
        }
        if (user.phone) params.append('agentPhone', user.phone);
        if (user.email) params.append('agentEmail', user.email);
        if (user.avatar) params.append('agentPhoto', user.avatar);

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      console.log('📄 Generating presentation from:', url);
      setLoadingStatus('Generating professional PDF...');

      const fileUri = (FileSystem.documentDirectory || FileSystem.cacheDirectory) + `presentation-${id}.pdf`;

      const downloadResult = await FileSystem.downloadAsync(
        url,
        fileUri,
        {
          headers: {
            'X-API-Key': 'fyr_44cb17e5192a0362110bbad92b49e52718b686dfd87907e685b41be0322e76cf',
            'X-API-Secret': '23845004e6846bdf4505f6ce5b9c1e9c53b263ca2f2f0b0829fb8b68e75c78423b762f7f7d575a90e70853a6d65b42a79fe99600fd7ec799e05478cfe35f3306'
          }
        }
      );

      if (downloadResult.status !== 200) {
        throw new Error('Failed to generate PDF. Server returned ' + downloadResult.status);
      }

      setLoadingStatus('Opening share menu...');
      console.log('✅ Presentation downloaded to:', downloadResult.uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Share ${property?.title} Presentation`
        });
      } else {
        alert('Sharing is not available on this device');
      }

      setPresentationModalVisible(false);
    } catch (e) {
      console.error('Presentation generation error:', e);
      alert('Error: ' + (e instanceof Error ? e.message : 'Unknown error during PDF generation'));
    } finally {
      setIsGenerating(false);
      setLoadingStatus('');
    }
  };

  const handleSendProjectToChat = async () => {
    if (!user) {
      alert('Please login to contact advisor');
      return;
    }

    try {
      setIsSendingToChat(true);

      const projectName = propertyResponse?.data?.name || '';
      const message = `I'm interested in project "${projectName}". I found it in ForYou app.`;
      // Using a default WhatsApp number +971585252877
      const whatsappUrl = `https://wa.me/971585252877?text=${encodeURIComponent(message)}`;

      await Linking.openURL(whatsappUrl);
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      alert('Could not open WhatsApp. Please make sure it is installed.');
    } finally {
      setIsSendingToChat(false);
    }
  };

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
    let locationStr: string;
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
      locationStr = areaStr;
    } else if (secondary) {
      // Для secondary area - це об'єкт
      const area = typeof secondary.area === 'object' && secondary.area
        ? secondary.area.nameEn
        : String(secondary.area || '');
      locationStr = area ? `${area}, ${secondary.city?.nameEn || ''}` : secondary.city?.nameEn || '';
    } else {
      locationStr = '';
    }

    // Переконуємося, що locationStr - це завжди рядок
    locationStr = String(locationStr || '');

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

    // Отримуємо списки areas та developers з відповіді (вони можуть бути на верхньому рівні)
    const propertyResponseAny = propertyResponse as any;
    const allAreas = propertyResponseAny?.areas || [];
    const allDevelopers = propertyResponseAny?.developers || [];

    // Обробка деталей району
    let areaDetails = null;
    const areaInfo = (apiProperty as any)?.areaInfo
      || (isOffPlan && offPlan && typeof offPlan.area === 'object' ? offPlan.area : null)
      || (!isOffPlan && secondary && typeof secondary.area === 'object' ? secondary.area : null)
      || (apiProperty as any)?.area
      || null;

    // Шукаємо розширені дані району в масиві areas
    const areaName = isOffPlan && offPlan && typeof offPlan.area === 'string'
      ? offPlan.area
      : (areaInfo?.nameEn || '');

    const matchedArea = allAreas.find((a: any) =>
      a.id === areaInfo?.id ||
      a.nameEn === areaName ||
      (typeof areaName === 'string' && areaName.includes(a.nameEn))
    );

    const areaDescriptionObj = matchedArea?.description || areaInfo?.description;
    const areaDescription = typeof areaDescriptionObj === 'object'
      ? (areaDescriptionObj?.description || areaDescriptionObj?.text || '')
      : (areaDescriptionObj || areaInfo?.infrastructure?.description || '');

    const areaPhotos = matchedArea?.images || areaInfo?.photos || areaInfo?.images || [];
    const areaAmenitiesList = areaInfo?.amenities || areaInfo?.facilities || matchedArea?.amenities || [];

    if (areaInfo || matchedArea) {
      areaDetails = {
        id: matchedArea?.id || areaInfo?.id || '',
        name: matchedArea?.nameEn || areaInfo?.nameEn || (typeof areaName === 'string' ? areaName.split(',')[0] : 'District'),
        description: areaDescription || '',
        photos: Array.isArray(areaPhotos) ? areaPhotos.filter((p: any) => p && typeof p === 'string') : [],
        amenities: Array.isArray(areaAmenitiesList) ? areaAmenitiesList.map((amenity: any) => ({
          id: amenity.id || amenity.amenityId || String(Math.random()),
          name: amenity.nameEn || amenity.nameRu || amenity.nameAr || amenity.name || amenity.amenityType || 'Amenity',
          icon: amenity.iconName || amenity.icon || 'home',
        })) : [],
      };
    }

    // Обробка девелопера
    let developerDetails = null;
    if (isOffPlan && offPlan?.developer) {
      const devId = (offPlan.developer as any).id;
      const matchedDev = allDevelopers.find((d: any) => d.id === devId || d.name === offPlan.developer?.name);

      const devDesc = matchedDev?.description || offPlan.developer.description;
      const devDescription = typeof devDesc === 'object'
        ? (devDesc.en || devDesc.ru || devDesc.description || '')
        : (devDesc || '');

      developerDetails = {
        id: matchedDev?.id || offPlan.developer.id || '',
        name: matchedDev?.name || offPlan.developer.name || '',
        logo: matchedDev?.logo || offPlan.developer.logo || null,
        description: devDescription,
        images: matchedDev?.images || [],
      };
    }

    // Конвертація facilities
    let facilities: any[] = [];
    const facilitiesData = apiProperty.facilities
      || (apiProperty as any).amenities
      || (apiProperty as any).amenity
      || (apiProperty as any).features
      || (apiProperty as any).highlights
      || (apiProperty as any).tags
      || (apiProperty as any).propertyAmenities
      || (apiProperty as any).project?.amenities
      || (apiProperty as any).building?.amenities
      || (offPlan as any)?.facilities
      || (offPlan as any)?.amenities
      || (secondary as any)?.facilities
      || (secondary as any)?.amenities
      || [];

    let finalFacilitiesArray: any[] = [];
    if (Array.isArray(facilitiesData)) {
      finalFacilitiesArray = facilitiesData;
    } else if (facilitiesData && typeof facilitiesData === 'object') {
      finalFacilitiesArray = Object.entries(facilitiesData)
        .filter(([_, value]) => value === true || value === 'true' || value === 1 || value === '1')
        .map(([key, _]) => key);
    } else if (typeof (facilitiesData as any) === 'string' && (facilitiesData as any).trim().length > 0) {
      finalFacilitiesArray = (facilitiesData as any).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }

    if (finalFacilitiesArray.length > 0) {
      facilities = finalFacilitiesArray.map((facility: any) => {
        if (typeof facility === 'string') {
          return {
            id: String(Math.random()),
            name: facility.split('_').join(' ').split('-').join(' ').replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase()),
          };
        }
        return {
          id: facility.id || facility.amenityId || String(Math.random()),
          name: facility.nameEn || facility.nameRu || facility.nameAr || facility.name || facility.amenityType || 'Facility',
        };
      });
    }

    // Конвертуція units для off-plan
    let availableUnits: any[] = [];
    if (isOffPlan && offPlan) {
      const unitsData = (offPlan as any)?.units
        || (apiProperty as any)?.units
        || (apiProperty as any)?.propertyUnits
        || [];

      if (Array.isArray(unitsData) && unitsData.length > 0) {
        availableUnits = unitsData.map((unit: any) => {
          const unitPrice = typeof unit.price === 'string' ? parseFloat(unit.price) : (unit.price as number) || 0;
          const priceAED = unit.priceAED || (unitPrice * 3.673);
          const totalSize = typeof unit.totalSize === 'string' ? parseFloat(unit.totalSize) : (unit.totalSize as number) || 0;

          return {
            id: unit.id || String(Math.random()),
            unitId: unit.unitId || '',
            type: unit.type || 'Apartment',
            price: formatPrice(priceAED, 'AED'),
            totalSize: Math.round(totalSize * 10) / 10,
            planImage: unit.planImage || null,
          };
        });
      }
    }

    return {
      id: apiProperty.id,
      title: apiProperty.name,
      price: priceFormatted,
      currency: '',
      location: locationStr,
      latitude,
      longitude,
      bedrooms,
      bathrooms,
      size,
      sizeUnit,
      handoverDate: '',
      images: apiProperty.photos || [],
      description: {
        text: typeof apiProperty.description === 'string' ? apiProperty.description : '',
      },
      facilities,
      availableUnits,
      developer: developerDetails,
      propertyType: apiProperty.propertyType,
      areaDetails,
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
            {property.images.length <= 8 ? (
              property.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))
            ) : (
              // Лише 8 крапок для великої кількості фото (sliding window)
              Array.from({ length: 8 }).map((_, i) => {
                let dotIndex;
                if (currentImageIndex < 4) {
                  dotIndex = i;
                } else if (currentImageIndex > property.images.length - 5) {
                  dotIndex = property.images.length - 8 + i;
                } else {
                  dotIndex = currentImageIndex - 3 + i;
                }

                return (
                  <View
                    key={i}
                    style={[
                      styles.paginationDot,
                      dotIndex === currentImageIndex && styles.paginationDotActive,
                      // Робимо крайні крапки меншими
                      (i === 0 || i === 7) && { transform: [{ scale: 0.6 }], opacity: 0.4 }
                    ]}
                  />
                );
              })
            )}
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
          </View>

          {/* Area Information */}
          {property.areaDetails && (
            property.areaDetails.description ||
            (property.areaDetails.photos && property.areaDetails.photos.length > 0) ||
            (property.areaDetails.amenities && property.areaDetails.amenities.length > 0)
          ) ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8 }]}>
                Area Information
              </Text>

              {/* Area Description */}
              {property.areaDetails.description ? (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 8, fontSize: 14 }]}>
                    About {property.areaDetails.name}
                  </Text>
                  <Text style={[styles.newsText, { color: theme.textSecondary }]}>
                    {property.areaDetails.description}
                  </Text>
                </>
              ) : null}

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
              ) : null}

              {/* Area Amenities */}
              {property.areaDetails.amenities && property.areaDetails.amenities.length > 0 ? (
                <>
                  <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12, marginTop: 16, fontSize: 14 }]}>
                    Area Amenities ({property.areaDetails.amenities.length})
                  </Text>
                  <View style={styles.facilitiesTagsContainer}>
                    {property.areaDetails.amenities.map((amenity: any) => (
                      <View
                        key={amenity.id}
                        style={[
                          styles.facilityTag,
                          { backgroundColor: theme.card, borderColor: theme.border }
                        ]}
                      >
                        <Text style={[styles.facilityTagText, { color: theme.textSecondary }]}>
                          {amenity.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : null}
            </View>
          ) : null}


          {/* Developer Banner */}
          {property.developer && (
            <View style={styles.section}>
              <Pressable
                style={[styles.reportageBanner, { backgroundColor: theme.primary }]}
                onPress={() => property.developer?.id && router.push(`/developers/${property.developer.id}` as any)}
              >
                <View style={styles.reportageHeader}>
                  {property.developer.logo && (
                    <View style={styles.developerLogoContainer}>
                      <Image
                        source={{ uri: property.developer.logo }}
                        style={styles.developerLogo}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                  <View style={styles.reportageTextContainer}>
                    <Text style={styles.reportageTitle}>{property.developer.name}</Text>
                    <Text style={styles.reportageSubtitle}>About Developer</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" style={{ opacity: 0.7 }} />
                </View>

                {property.developer.description && (
                  <Text style={styles.developerDescription} numberOfLines={3}>
                    {property.developer.description}
                  </Text>
                )}

                {property.developer.images && property.developer.images.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.developerPhotosScroll}
                    contentContainerStyle={styles.developerPhotosContent}
                    pointerEvents="none" // Дозволяє натискати на банер крізь фото
                  >
                    {property.developer.images.map((img: string, idx: number) => (
                      <Image
                        key={idx}
                        source={{ uri: img }}
                        style={styles.developerPhoto}
                      />
                    ))}
                  </ScrollView>
                )}


              </Pressable>
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
      {/* Standardized Island Footer */}
      <View style={styles.footerContainer} pointerEvents="box-none">
        <View style={[styles.footerBackground, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }]}>
          <BlurView
            intensity={100}
            tint={isDark ? 'dark' : 'light'}
            style={styles.footerInner}
          >
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: (user?.role !== 'INVESTOR' && isFromCollection) ? '#FF6B5D' : theme.primary,
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                  opacity: pressed ? 0.8 : 1,
                }
              ]}
              onPress={user?.role === 'INVESTOR' ? handleSendProjectToChat : () => {
                if (isFromCollection) {
                  console.log('Remove from collection');
                } else {
                  setSelectCollectionVisible(true);
                }
              }}
              disabled={isSendingToChat}
            >
              {isSendingToChat ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {user?.role === 'INVESTOR' ? 'Get more info' : (isFromCollection ? 'Remove from collection' : 'Add to collection')}
                </Text>
              )}
            </Pressable>

            {/* Presentation Button */}
            {!isFromCollection && user?.role !== 'INVESTOR' && (
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.card, // Or transparent
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    opacity: pressed ? 0.7 : 1,
                  }
                ]}
                onPress={() => setPresentationModalVisible(true)}
              >
                <Ionicons name="document-text-outline" size={20} color={theme.text} />
              </Pressable>
            )}

            {/* Like Button */}
            {!isFromCollection && (
              <Pressable
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    borderColor: user?.role === 'INVESTOR' ? 'rgba(255,255,255,0.3)' : theme.border,
                    backgroundColor: user?.role === 'INVESTOR' ? 'transparent' : theme.card,
                    transform: [{ scale: pressed ? 0.96 : 1 }],
                    opacity: pressed ? 0.7 : 1,
                    overflow: 'hidden',
                  }
                ]}
                onPress={toggleFavorite}
              >
                {user?.role === 'INVESTOR' ? (
                  <BlurView intensity={25} tint="light" style={StyleSheet.absoluteFill}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons
                        name={isFavoriteProperty ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavoriteProperty ? "#FF3B30" : theme.primary}
                      />
                    </View>
                  </BlurView>
                ) : (
                  <Ionicons
                    name={isFavoriteProperty ? "heart" : "heart-outline"}
                    size={20}
                    color={isFavoriteProperty ? "#FF3B30" : theme.text}
                  />
                )}
              </Pressable>
            )}
          </BlurView>
        </View>
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

      {/* Presentation Generation Modal */}
      <Modal
        visible={presentationModalVisible}
        transparent
        animationType="none"
        onRequestClose={() => !isGenerating && setPresentationModalVisible(false)}
      >
        <Animated.View
          style={[
            styles.menuBackdrop,
            {
              opacity: presentationBackdropOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => !isGenerating && setPresentationModalVisible(false)}
          />
          <Animated.View
            style={[
              styles.menuContent,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                transform: [
                  {
                    translateY: presentationSlideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [600, 0], // Increased for better safety
                    }),
                  },
                ],
                paddingBottom: insets.bottom + 12,
              },
            ]}
          >
            <View style={styles.dragHandleContainer}>
              <View style={[styles.dragHandle, { backgroundColor: theme.textSecondary }]} />
            </View>

            <View style={{ padding: 24, paddingBottom: 0, alignItems: 'center' }}>
              <View style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: theme.card,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16
              }}>
                <Ionicons name="document-text" size={32} color={theme.primary} />
              </View>

              <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text, marginBottom: 8, textAlign: 'center' }}>
                Generate Presentation
              </Text>

              <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 32, textAlign: 'center' }}>
                Create a professional PDF presentation for {property?.title} to share with your clients.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.bottomButton,
                  {
                    backgroundColor: theme.primary,
                    width: '100%',
                    flex: 0, // Fix for visibility in modal
                    minHeight: 56,
                    opacity: (isGenerating || pressed) ? 0.7 : 1,
                    flexDirection: 'row',
                    gap: 10,
                    marginBottom: 8
                  }
                ]}
                onPress={handleGeneratePresentation}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Ionicons name="share-outline" size={20} color="white" />
                )}
                <Text style={styles.bottomButtonText}>
                  {isGenerating ? 'Generating PDF...' : 'Create & Share PDF'}
                </Text>
              </Pressable>

              <Pressable
                style={{ padding: 8, opacity: isGenerating ? 0.5 : 1 }}
                onPress={() => !isGenerating && setPresentationModalVisible(false)}
                disabled={isGenerating}
              >
                <Text style={{ color: theme.textSecondary, fontSize: 15 }}>Cancel</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Select Collection Modal */}
      <SelectCollectionModal
        visible={selectCollectionVisible}
        onClose={() => setSelectCollectionVisible(false)}
        propertyId={id as string}
        propertyImage={property?.images?.[0]}
        onSuccess={() => {
          // Could add a toast here
          console.log('✅ Property successfully added to collection');
        }}
      />
    </View >
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
    paddingBottom: 80, // Reduced padding
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
  facilitiesTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  facilityTagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  reportageBanner: {
    borderRadius: 16,
    padding: 20,
  },
  reportageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  developerLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  developerLogo: {
    width: '100%',
    height: '100%',
  },
  developerDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 16,
  },
  developerPhotosScroll: {
    marginHorizontal: -20,
  },
  developerPhotosContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  developerPhoto: {
    width: 150,
    height: 100,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  reportageTextContainer: {
    flex: 1,
  },
  reportageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  reportageSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
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
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  footerBackground: {
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  footerInner: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 44, // Slightly larger visual target or explicitly matches height of submit
    aspectRatio: 1, // Square/Circle
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

