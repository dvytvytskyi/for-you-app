import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PropertyFilters {
  listingType: 'offplan' | 'secondary';
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string;
  bedrooms: string; // Changed from number[] to string ('any' or '1,2,3')
  location: string;
}

interface PropertyFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onApply: (filters: PropertyFilters) => void;
}

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

// Price options from 100K to 30M
const PRICE_OPTIONS = [
  { value: 100000, label: '$100K' },
  { value: 200000, label: '$200K' },
  { value: 300000, label: '$300K' },
  { value: 400000, label: '$400K' },
  { value: 500000, label: '$500K' },
  { value: 600000, label: '$600K' },
  { value: 700000, label: '$700K' },
  { value: 800000, label: '$800K' },
  { value: 900000, label: '$900K' },
  { value: 1000000, label: '$1M' },
  { value: 1500000, label: '$1.5M' },
  { value: 2000000, label: '$2M' },
  { value: 2500000, label: '$2.5M' },
  { value: 3000000, label: '$3M' },
  { value: 4000000, label: '$4M' },
  { value: 5000000, label: '$5M' },
  { value: 6000000, label: '$6M' },
  { value: 7000000, label: '$7M' },
  { value: 8000000, label: '$8M' },
  { value: 9000000, label: '$9M' },
  { value: 10000000, label: '$10M' },
  { value: 15000000, label: '$15M' },
  { value: 20000000, label: '$20M' },
  { value: 25000000, label: '$25M' },
  { value: 30000000, label: '$30M' },
];

const PROPERTY_TYPES = ['all', 'apartment', 'villa', 'penthouse', 'townhouse', 'studio'];

const DUBAI_LOCATIONS = [
  { id: 'any', name: 'Any Location' },
  { id: 'downtown', name: 'Downtown Dubai' },
  { id: 'marina', name: 'Dubai Marina' },
  { id: 'jbr', name: 'Jumeirah Beach Residence (JBR)' },
  { id: 'palm', name: 'Palm Jumeirah' },
  { id: 'jlt', name: 'Jumeirah Lake Towers (JLT)' },
  { id: 'business-bay', name: 'Business Bay' },
  { id: 'difc', name: 'Dubai International Financial Centre (DIFC)' },
  { id: 'arabian-ranches', name: 'Arabian Ranches' },
  { id: 'springs', name: 'The Springs' },
  { id: 'meadows', name: 'The Meadows' },
  { id: 'lakes', name: 'The Lakes' },
  { id: 'greens', name: 'The Greens' },
  { id: 'views', name: 'The Views' },
  { id: 'dubai-hills', name: 'Dubai Hills Estate' },
  { id: 'damac-hills', name: 'DAMAC Hills' },
  { id: 'town-square', name: 'Town Square' },
  { id: 'motor-city', name: 'Motor City' },
  { id: 'sports-city', name: 'Sports City' },
  { id: 'discovery-gardens', name: 'Discovery Gardens' },
  { id: 'international-city', name: 'International City' },
  { id: 'silicon-oasis', name: 'Dubai Silicon Oasis' },
  { id: 'mirdif', name: 'Mirdif' },
  { id: 'deira', name: 'Deira' },
  { id: 'bur-dubai', name: 'Bur Dubai' },
  { id: 'creek-harbour', name: 'Dubai Creek Harbour' },
  { id: 'bluewaters', name: 'Bluewaters Island' },
  { id: 'city-walk', name: 'City Walk' },
  { id: 'la-mer', name: 'La Mer' },
  { id: 'dubai-south', name: 'Dubai South' },
  { id: 'expo-city', name: 'Expo City Dubai' },
];

export default function PropertyFiltersModal({
  visible,
  onClose,
  filters: initialFilters,
  onApply,
}: PropertyFiltersModalProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [showMinPriceDropdown, setShowMinPriceDropdown] = useState(false);
  const [showMaxPriceDropdown, setShowMaxPriceDropdown] = useState(false);
  const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
  const [showBedroomsDropdown, setShowBedroomsDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const modalSlideAnim = useState(new Animated.Value(SCREEN_HEIGHT * 0.8))[0];
  const minPriceSlideAnim = useState(new Animated.Value(SCREEN_HEIGHT * 0.6))[0];
  const maxPriceSlideAnim = useState(new Animated.Value(SCREEN_HEIGHT * 0.6))[0];
  const propertyTypeSlideAnim = useState(new Animated.Value(SCREEN_HEIGHT * 0.6))[0];
  const bedroomsSlideAnim = useState(new Animated.Value(SCREEN_HEIGHT * 0.6))[0];
  const locationSlideAnim = useState(new Animated.Value(SCREEN_HEIGHT * 0.6))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    }
  }, [visible]);

  useEffect(() => {
    if (showMinPriceDropdown) {
      Animated.spring(minPriceSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    }
  }, [showMinPriceDropdown]);

  useEffect(() => {
    if (showMaxPriceDropdown) {
      Animated.spring(maxPriceSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    }
  }, [showMaxPriceDropdown]);

  useEffect(() => {
    if (showPropertyTypeDropdown) {
      Animated.spring(propertyTypeSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    }
  }, [showPropertyTypeDropdown]);

  useEffect(() => {
    if (showBedroomsDropdown) {
      Animated.spring(bedroomsSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    }
  }, [showBedroomsDropdown]);

  useEffect(() => {
    if (showLocationDropdown) {
      Animated.spring(locationSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    }
  }, [showLocationDropdown]);

  const closeMinPriceDropdown = () => {
    Animated.timing(minPriceSlideAnim, {
      toValue: SCREEN_HEIGHT * 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowMinPriceDropdown(false);
    });
  };

  const closeMaxPriceDropdown = () => {
    Animated.timing(maxPriceSlideAnim, {
      toValue: SCREEN_HEIGHT * 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowMaxPriceDropdown(false);
    });
  };

  const closePropertyTypeDropdown = () => {
    Animated.timing(propertyTypeSlideAnim, {
      toValue: SCREEN_HEIGHT * 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPropertyTypeDropdown(false);
    });
  };

  const closeBedroomsDropdown = () => {
    Animated.timing(bedroomsSlideAnim, {
      toValue: SCREEN_HEIGHT * 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowBedroomsDropdown(false);
    });
  };

  const closeLocationDropdown = () => {
    Animated.timing(locationSlideAnim, {
      toValue: SCREEN_HEIGHT * 0.6,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowLocationDropdown(false);
    });
  };

  const closeModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: SCREEN_HEIGHT * 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleReset = () => {
    setFilters({
      listingType: 'offplan',
      minPrice: null,
      maxPrice: null,
      propertyType: 'all',
      bedrooms: 'any',
      location: 'any',
    });
  };

  const handleApply = () => {
    onApply(filters);
    closeModal();
  };

  const getBedroomsLabel = () => {
    if (!filters.bedrooms || filters.bedrooms === 'any') return 'Any';
    const bedroomsList = filters.bedrooms.split(',').map(Number);
    if (bedroomsList.length === 1) return `${bedroomsList[0]}`;
    return bedroomsList.join(', ');
  };

  const toggleBedroom = (bedroom: number | string) => {
    if (bedroom === 'any') {
      setFilters(prev => ({ ...prev, bedrooms: 'any' }));
      return;
    }
    
    const bedroomNum = Number(bedroom);
    const current = filters.bedrooms === 'any' ? [] : filters.bedrooms.split(',').map(Number).filter(Boolean);
    
    let newBedrooms: number[];
    if (current.includes(bedroomNum)) {
      newBedrooms = current.filter(b => b !== bedroomNum);
    } else {
      newBedrooms = [...current, bedroomNum].sort((a, b) => a - b);
    }
    
    setFilters(prev => ({ 
      ...prev, 
      bedrooms: newBedrooms.length === 0 ? 'any' : newBedrooms.join(',')
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={closeModal} />
        
        <Animated.View 
          style={[
            styles.modalContent, 
            { backgroundColor: theme.background },
            { transform: [{ translateY: modalSlideAnim }] }
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [
                  styles.closeButton,
                  { opacity: pressed ? 0.5 : 1 }
                ]}
              >
                <Ionicons name="chevron-down" size={26} color={theme.text} />
              </Pressable>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {t('properties.filters')}
              </Text>
              <View style={styles.closeButton} />
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Listing Type */}
              <View style={styles.section}>
                <View style={styles.toggleContainer}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.toggleButton,
                      {
                        backgroundColor: filters.listingType === 'offplan'
                          ? theme.primary
                          : theme.card,
                        borderColor: filters.listingType === 'offplan'
                          ? theme.primary
                          : theme.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, listingType: 'offplan' }))}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        {
                          color: filters.listingType === 'offplan'
                            ? '#FFFFFF'
                            : theme.text,
                        },
                      ]}
                    >
                      Off plan
                    </Text>
                  </Pressable>
                  
                  <Pressable
                    style={({ pressed }) => [
                      styles.toggleButton,
                      {
                        backgroundColor: filters.listingType === 'secondary'
                          ? theme.primary
                          : theme.card,
                        borderColor: filters.listingType === 'secondary'
                          ? theme.primary
                          : theme.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    onPress={() => setFilters(prev => ({ ...prev, listingType: 'secondary' }))}
                  >
                    <Text
                      style={[
                        styles.toggleText,
                        {
                          color: filters.listingType === 'secondary'
                            ? '#FFFFFF'
                            : theme.text,
                        },
                      ]}
                    >
                      Secondary
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('properties.priceRange')}
                </Text>
                
                <View style={styles.priceContainer}>
                  <View style={styles.priceInput}>
                    <Pressable
                      style={[
                        styles.priceButton,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setShowMinPriceDropdown(true)}
                    >
                      <Text style={[
                        styles.priceValue,
                        { color: filters.minPrice ? theme.text : theme.textSecondary }
                      ]}>
                        {filters.minPrice 
                          ? PRICE_OPTIONS.find(p => p.value === filters.minPrice)?.label 
                          : t('properties.minPrice')}
                      </Text>
                      <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
                    </Pressable>
                  </View>
                  
                  <View style={styles.priceInput}>
                    <Pressable
                      style={[
                        styles.priceButton,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setShowMaxPriceDropdown(true)}
                    >
                      <Text style={[
                        styles.priceValue,
                        { color: filters.maxPrice ? theme.text : theme.textSecondary }
                      ]}>
                        {filters.maxPrice 
                          ? PRICE_OPTIONS.find(p => p.value === filters.maxPrice)?.label 
                          : t('properties.maxPrice')}
                      </Text>
                      <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/* Property Type */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('properties.propertyType')}
                </Text>
                
                <Pressable
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setShowPropertyTypeDropdown(true)}
                >
                  <Text style={[
                    styles.dropdownText, 
                    { color: filters.propertyType !== 'all' ? theme.text : theme.textSecondary }
                  ]}>
                    {t(`properties.propertyTypes.${filters.propertyType}`)}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>

              {/* Bedrooms */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Bedrooms
                </Text>
                
                <Pressable
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setShowBedroomsDropdown(true)}
                >
                  <Text style={[
                    styles.dropdownText, 
                    { color: filters.bedrooms !== 'any' ? theme.text : theme.textSecondary }
                  ]}>
                    {getBedroomsLabel()}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('properties.location')}
                </Text>
                
                <Pressable
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setShowLocationDropdown(true)}
                >
                  <Text style={[
                    styles.dropdownText, 
                    { color: filters.location !== 'any' ? theme.text : theme.textSecondary }
                  ]}>
                    {filters.location !== 'any'
                      ? DUBAI_LOCATIONS.find(loc => loc.id === filters.location)?.name 
                      : t('properties.selectFromList')}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
                </Pressable>
              </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.resetButton,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Ionicons name="reload-outline" size={24} color={theme.textSecondary} />
              </Pressable>

              <Pressable
                onPress={handleApply}
                style={({ pressed }) => [
                  styles.applyButton,
                  {
                    backgroundColor: theme.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text style={styles.applyButtonText}>
                  {t('properties.applyFilters')}
                </Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>

      {/* Min Price Dropdown Modal */}
      <Modal
        visible={showMinPriceDropdown}
        transparent
        animationType="none"
        onRequestClose={closeMinPriceDropdown}
      >
        <View style={styles.dropdownModalOverlay}>
          <Pressable style={styles.dropdownBackdrop} onPress={closeMinPriceDropdown} />
          <Animated.View 
            style={[
              styles.dropdownModalContent, 
              { backgroundColor: theme.background },
              { transform: [{ translateY: minPriceSlideAnim }] }
            ]}
          >
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownHeaderTitle, { color: theme.text }]}>
                {t('properties.minPrice')}
              </Text>
              <Pressable onPress={closeMinPriceDropdown}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.dropdownScrollView} contentContainerStyle={styles.dropdownScrollContent}>
              {PRICE_OPTIONS.map((price) => (
                <Pressable
                  key={price.value}
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: theme.border },
                    filters.minPrice === price.value && { backgroundColor: theme.primaryLight },
                  ]}
                  onPress={() => {
                    setFilters(prev => ({ ...prev, minPrice: price.value }));
                    closeMinPriceDropdown();
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: filters.minPrice === price.value ? theme.primary : theme.text }
                  ]}>
                    {price.label}
                  </Text>
                  {filters.minPrice === price.value && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Max Price Dropdown Modal */}
      <Modal
        visible={showMaxPriceDropdown}
        transparent
        animationType="none"
        onRequestClose={closeMaxPriceDropdown}
      >
        <View style={styles.dropdownModalOverlay}>
          <Pressable style={styles.dropdownBackdrop} onPress={closeMaxPriceDropdown} />
          <Animated.View 
            style={[
              styles.dropdownModalContent, 
              { backgroundColor: theme.background },
              { transform: [{ translateY: maxPriceSlideAnim }] }
            ]}
          >
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownHeaderTitle, { color: theme.text }]}>
                {t('properties.maxPrice')}
              </Text>
              <Pressable onPress={closeMaxPriceDropdown}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.dropdownScrollView} contentContainerStyle={styles.dropdownScrollContent}>
              {PRICE_OPTIONS.map((price) => (
                <Pressable
                  key={price.value}
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: theme.border },
                    filters.maxPrice === price.value && { backgroundColor: theme.primaryLight },
                  ]}
                  onPress={() => {
                    setFilters(prev => ({ ...prev, maxPrice: price.value }));
                    closeMaxPriceDropdown();
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: filters.maxPrice === price.value ? theme.primary : theme.text }
                  ]}>
                    {price.label}
                  </Text>
                  {filters.maxPrice === price.value && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Property Type Dropdown Modal */}
      <Modal
        visible={showPropertyTypeDropdown}
        transparent
        animationType="none"
        onRequestClose={closePropertyTypeDropdown}
      >
        <View style={styles.dropdownModalOverlay}>
          <Pressable style={styles.dropdownBackdrop} onPress={closePropertyTypeDropdown} />
          <Animated.View 
            style={[
              styles.dropdownModalContent, 
              { backgroundColor: theme.background },
              { transform: [{ translateY: propertyTypeSlideAnim }] }
            ]}
          >
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownHeaderTitle, { color: theme.text }]}>
                {t('properties.propertyType')}
              </Text>
              <Pressable onPress={closePropertyTypeDropdown}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.dropdownScrollView} contentContainerStyle={styles.dropdownScrollContent}>
              {PROPERTY_TYPES.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: theme.border },
                    filters.propertyType === type && { backgroundColor: theme.primaryLight },
                  ]}
                  onPress={() => {
                    setFilters(prev => ({ ...prev, propertyType: type }));
                    closePropertyTypeDropdown();
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: filters.propertyType === type ? theme.primary : theme.text }
                  ]}>
                    {t(`properties.propertyTypes.${type}`)}
                  </Text>
                  {filters.propertyType === type && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Bedrooms Dropdown Modal */}
      <Modal
        visible={showBedroomsDropdown}
        transparent
        animationType="none"
        onRequestClose={closeBedroomsDropdown}
      >
        <View style={styles.dropdownModalOverlay}>
          <Pressable style={styles.dropdownBackdrop} onPress={closeBedroomsDropdown} />
          <Animated.View 
            style={[
              styles.dropdownModalContent, 
              { backgroundColor: theme.background },
              { transform: [{ translateY: bedroomsSlideAnim }] }
            ]}
          >
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownHeaderTitle, { color: theme.text }]}>
                Bedrooms
              </Text>
              <Pressable onPress={closeBedroomsDropdown}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.dropdownScrollView} contentContainerStyle={styles.dropdownScrollContent}>
              <Pressable
                style={[
                  styles.dropdownItem,
                  { borderBottomColor: theme.border },
                  filters.bedrooms === 'any' && { backgroundColor: theme.primaryLight },
                ]}
                onPress={() => {
                  toggleBedroom('any');
                  closeBedroomsDropdown();
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  { color: filters.bedrooms === 'any' ? theme.primary : theme.text }
                ]}>
                  Any
                </Text>
                {filters.bedrooms === 'any' && (
                  <Ionicons name="checkmark" size={20} color={theme.primary} />
                )}
              </Pressable>
              {BEDROOM_OPTIONS.map((bedroom) => {
                const isSelected = filters.bedrooms !== 'any' && 
                  filters.bedrooms.split(',').map(Number).includes(bedroom);
                return (
                  <Pressable
                    key={bedroom}
                    style={[
                      styles.dropdownItem,
                      { borderBottomColor: theme.border },
                      isSelected && { backgroundColor: theme.primaryLight },
                    ]}
                    onPress={() => toggleBedroom(bedroom)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      { color: isSelected ? theme.primary : theme.text }
                    ]}>
                      {bedroom}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color={theme.primary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Location Dropdown Modal */}
      <Modal
        visible={showLocationDropdown}
        transparent
        animationType="none"
        onRequestClose={closeLocationDropdown}
      >
        <View style={styles.dropdownModalOverlay}>
          <Pressable style={styles.dropdownBackdrop} onPress={closeLocationDropdown} />
          <Animated.View 
            style={[
              styles.dropdownModalContent, 
              { backgroundColor: theme.background },
              { transform: [{ translateY: locationSlideAnim }] }
            ]}
          >
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownHeaderTitle, { color: theme.text }]}>
                {t('properties.location')}
              </Text>
              <Pressable onPress={closeLocationDropdown}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.dropdownScrollView} contentContainerStyle={styles.dropdownScrollContent}>
              {DUBAI_LOCATIONS.map((location) => (
                <Pressable
                  key={location.id}
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: theme.border },
                    filters.location === location.id && { backgroundColor: theme.primaryLight },
                  ]}
                  onPress={() => {
                    setFilters({ ...filters, location: location.id });
                    closeLocationDropdown();
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    { color: filters.location === location.id ? theme.primary : theme.text }
                  ]}>
                    {location.name}
                  </Text>
                  {filters.location === location.id && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    height: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  priceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  resetButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButton: {
    flex: 1,
    height: 52,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownModalContent: {
    maxHeight: SCREEN_HEIGHT * 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  dropdownHeaderTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  dropdownScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  dropdownScrollContent: {
    paddingBottom: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  dropdownItemText: {
    fontSize: 15,
  },
});

