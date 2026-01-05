import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { propertiesApi } from '@/api/properties';
import PriceRangeSlider from './PriceRangeSlider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PropertyFilters {
  listingType: 'all' | 'offplan' | 'secondary';
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string;
  bedrooms: string;
  location: string;
}

interface PropertyFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onApply: (filters: PropertyFilters) => void;
}

const BEDROOM_OPTIONS = ['studio', '1', '2', '3', '4', '5+'];

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

const PROPERTY_TYPES = ['apartment', 'villa', 'penthouse', 'townhouse', 'duplex', 'office'];

const PROPERTY_TYPE_ICONS: Record<string, string> = {
  apartment: 'business-outline',
  villa: 'home-outline',
  penthouse: 'layers-outline',
  townhouse: 'grid-outline',
  duplex: 'copy-outline',
  office: 'briefcase-outline',
};

const DUBAI_LOCATIONS = [
  { id: 'Downtown Dubai', name: 'Downtown Dubai' },
  { id: 'Dubai Marina', name: 'Dubai Marina' },
  { id: 'Jumeirah Beach Residence (JBR)', name: 'Jumeirah Beach Residence (JBR)' },
  { id: 'Palm Jumeirah', name: 'Palm Jumeirah' },
  { id: 'Jumeirah Lake Towers (JLT)', name: 'Jumeirah Lake Towers (JLT)' },
  { id: 'Business Bay', name: 'Business Bay' },
  { id: 'Dubai Hills Estate', name: 'Dubai Hills Estate' },
  { id: 'Dubai Creek Harbour', name: 'Dubai Creek Harbour' },
  { id: 'Marbella', name: 'Marbella' },
  { id: 'Golden Mile', name: 'Golden Mile' },
  { id: 'Puerto Banus', name: 'Puerto Banus' },
  { id: 'San Pedro de Alcantara', name: 'San Pedro de Alcantara' },
  { id: 'Zagaleta', name: 'Zagaleta' },
  { id: 'Sierra Blanca', name: 'Sierra Blanca' },
];

export default function PropertyFiltersModal({
  visible,
  onClose,
  filters: initialFilters,
  onApply,
}: PropertyFiltersModalProps) {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const modalSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Reverted to hardcoded locations due to 404 on API
  const locations = DUBAI_LOCATIONS;

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

  const closeModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleReset = () => {
    setFilters({
      listingType: 'all',
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

  const toggleBedroom = (bedroom: string) => {
    const current = filters.bedrooms === 'any' ? [] : filters.bedrooms.split(',').filter(Boolean);
    let newBedrooms: string[];

    if (current.includes(bedroom)) {
      newBedrooms = current.filter(b => b !== bedroom);
    } else {
      newBedrooms = [...current, bedroom];
    }

    setFilters(prev => ({
      ...prev,
      bedrooms: newBedrooms.length === 0 ? 'any' : newBedrooms.join(',')
    }));
  };

  const toggleLocation = (locationId: string) => {
    const current = filters.location === 'any' ? [] : filters.location.split('|').filter(Boolean);
    let newLocations: string[];

    if (current.includes(locationId)) {
      newLocations = current.filter(l => l !== locationId);
    } else {
      newLocations = [...current, locationId];
    }

    setFilters(prev => ({
      ...prev,
      location: newLocations.length === 0 ? 'any' : newLocations.join('|')
    }));
  };

  const togglePropertyType = (type: string) => {
    const current = filters.propertyType === 'all' ? [] : filters.propertyType.split(',').filter(Boolean);
    let newTypes: string[];

    if (current.includes(type)) {
      newTypes = current.filter(t => t !== type);
    } else {
      newTypes = [...current, type];
    }

    setFilters(prev => ({
      ...prev,
      propertyType: newTypes.length === 0 ? 'all' : newTypes.join(',')
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
          <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={[styles.headerContainer, { borderBottomColor: theme.border }]}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [
                  styles.styledBackButton,
                  { backgroundColor: theme.primaryLight },
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Ionicons name="chevron-back" size={24} color={theme.primary} />
              </Pressable>

              <View style={styles.headerTitleWrapper}>
                <Text style={[styles.headerTitleText, { color: theme.text }]}>
                  {t('properties.filters')}
                </Text>
              </View>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Price Range */}
              <View style={styles.section}>
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  priceOptions={PRICE_OPTIONS}
                  onValueChange={(min, max) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
                />
              </View>

              {/* Bedrooms */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: 16 }]}>
                  Bedrooms
                </Text>

                <View style={styles.bedsGridContainer}>
                  <View style={styles.bedsRow}>
                    {['studio', '1', '2'].map((option) => (
                      <BedOption
                        key={option}
                        label={option === 'studio' ? 'Studio' : option}
                        isSelected={filters.bedrooms !== 'any' && filters.bedrooms.split(',').includes(option)}
                        onPress={() => toggleBedroom(option)}
                        theme={theme}
                      />
                    ))}
                  </View>
                  <View style={styles.bedsRow}>
                    {['3', '4', '5+'].map((option) => (
                      <BedOption
                        key={option}
                        label={option}
                        isSelected={filters.bedrooms !== 'any' && filters.bedrooms.split(',').includes(option)}
                        onPress={() => toggleBedroom(option)}
                        theme={theme}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* Location */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: 16 }]}>
                  {t('properties.location')}
                </Text>

                <View style={styles.locationsWrapper}>
                  {locations.map((location) => {
                    const isSelected = filters.location !== 'any' && filters.location.split('|').includes(location.id);
                    return (
                      <LocationOption
                        key={location.id}
                        label={location.name}
                        isSelected={isSelected}
                        onPress={() => toggleLocation(location.id)}
                        theme={theme}
                      />
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            {/* Floating Footer Island */}
            <View style={[styles.footerIsland, { borderColor: theme.border }]}>
              <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.resetButton,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[styles.resetButtonText, { color: '#999' }]}>
                  Reset
                </Text>
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
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function PropertyTypeButton({ type, label, isSelected, onPress, theme }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1 : 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.9, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: isSelected ? 1 : 0.95, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.propertyChip,
          {
            backgroundColor: isSelected ? theme.primary : theme.card,
            borderColor: isSelected ? theme.primary : theme.border,
          }
        ]}
      >
        <Ionicons
          name={PROPERTY_TYPE_ICONS[type] as any}
          size={20}
          color={isSelected ? '#FFF' : theme.text}
          style={styles.propertyChipIcon}
        />
        <Text style={[
          styles.propertyChipText,
          { color: isSelected ? '#FFF' : theme.textSecondary }
        ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function BedOption({ label, isSelected, onPress, theme }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1 : 0.98,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: isSelected ? 1 : 0.98, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.bedOption,
          {
            backgroundColor: isSelected ? theme.primary : theme.card,
            borderColor: isSelected ? theme.primary : theme.border,
          }
        ]}
      >
        <Text style={[
          styles.bedOptionText,
          { color: isSelected ? '#FFF' : theme.text }
        ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function LocationOption({ label, isSelected, onPress, theme }: any) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1 : 0.98,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: isSelected ? 1 : 0.98, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.locationChip,
          {
            backgroundColor: isSelected ? theme.primary : theme.card,
            borderColor: isSelected ? theme.primary : theme.border,
          }
        ]}
      >
        <Text style={[
          styles.locationChipText,
          { color: isSelected ? '#FFF' : theme.text }
        ]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
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
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    position: 'relative',
  },
  headerTitleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  styledBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 140, // Increased to account for floating footer
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  propertyTypeScrollContent: {
    gap: 12,
  },
  propertyChip: {
    width: 100,
    height: 100,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  propertyChipIcon: {
    alignSelf: 'flex-start',
  },
  propertyChipText: {
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-end',
    textAlign: 'right',
  },
  bedsGridContainer: {
    gap: 8,
  },
  bedsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bedOption: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  bedOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  locationsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationChip: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerIsland: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  resetButton: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
