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
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { propertiesApi, FilterOptions } from '@/api/properties';
import { triggerLightHaptic, triggerMediumHaptic } from '@/utils/haptic';
import PriceRangeSlider from './PriceRangeSlider';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PropertyFilters {
  listingType: 'all' | 'offplan' | 'secondary';
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: string;
  location: string;
  developerIds: string;
}

interface PropertyFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  filters: PropertyFilters;
  onApply: (filters: PropertyFilters) => void;
}

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
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const modalSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Search and data states
  const [locationSearch, setLocationSearch] = useState('');
  const [developerSearch, setDeveloperSearch] = useState('');

  // Новий єдиний запит для метаданих фільтрів
  const { data: filterOptions } = useQuery({
    queryKey: ['project-filter-options'],
    queryFn: () => propertiesApi.getFilterOptions(),
    enabled: visible,
    staleTime: 5 * 60 * 1000, // 5 хвилин кешу
  });

  const locations = filterOptions?.locations || [];
  const developers = filterOptions?.developers || [];
  const bedroomsOptions = filterOptions?.bedrooms || ['Studio', '1', '2', '3', '4', '5+'];

  // Динамічний діапазон цін
  const minPriceAllowed = filterOptions?.priceRange?.min || 100000;
  const maxPriceAllowed = filterOptions?.priceRange?.max || 30000000;

  useEffect(() => {
    if (visible) {
      Animated.spring(modalSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
      setFilters(initialFilters);
    }
  }, [visible, initialFilters]);

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
    triggerLightHaptic();
    setFilters({
      listingType: 'all',
      minPrice: null,
      maxPrice: null,
      bedrooms: 'any',
      location: 'any',
      developerIds: 'any',
    });
  };

  const handleApply = () => {
    triggerLightHaptic();
    onApply(filters);
    closeModal();
  };

  const toggleBedroom = (bedroom: string) => {
    triggerLightHaptic();
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
    triggerLightHaptic();
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

  const toggleDeveloper = (developerId: string) => {
    triggerLightHaptic();
    const current = filters.developerIds === 'any' ? [] : filters.developerIds.split(',').filter(Boolean);
    let newDevelopers: string[];

    if (current.includes(developerId)) {
      newDevelopers = current.filter(d => d !== developerId);
    } else {
      newDevelopers = [...current, developerId];
    }

    setFilters(prev => ({
      ...prev,
      developerIds: newDevelopers.length === 0 ? 'any' : newDevelopers.join(',')
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
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [
                  styles.backButton,
                  { opacity: pressed ? 0.6 : 1 }
                ]}
              >
                <Ionicons name="chevron-back" size={24} color={theme.primary} />
              </Pressable>

              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {t('properties.filters')}
              </Text>

              <View style={styles.backButton} />
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
              nestedScrollEnabled={true}
            >
              {/* Price Range */}
              <View style={styles.section}>
                <PriceRangeSlider
                  minPrice={filters.minPrice}
                  maxPrice={filters.maxPrice}
                  priceOptions={PRICE_OPTIONS}
                  onValueChange={(min, max) => setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }))}
                  onToggleScroll={setScrollEnabled}
                />
              </View>



              {/* Bedrooms */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: 16 }]}>
                  Bedrooms
                </Text>

                <View style={[styles.bedsGridContainer, { zIndex: 1 }]}>
                  <View style={styles.bedsRow}>
                    {bedroomsOptions.slice(0, 3).map((option) => (
                      <BedOption
                        key={option}
                        label={option}
                        isSelected={filters.bedrooms !== 'any' && filters.bedrooms.split(',').includes(option.toLowerCase())}
                        onPress={() => toggleBedroom(option.toLowerCase())}
                        theme={theme}
                      />
                    ))}
                  </View>
                  <View style={styles.bedsRow}>
                    {bedroomsOptions.slice(3, 6).map((option) => (
                      <BedOption
                        key={option}
                        label={option}
                        isSelected={filters.bedrooms !== 'any' && filters.bedrooms.split(',').includes(option.toLowerCase())}
                        onPress={() => toggleBedroom(option.toLowerCase())}
                        theme={theme}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* Location */}
              <View style={[styles.section, { zIndex: 100 }]}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: 16 }]}>
                  {t('properties.location')}
                </Text>

                <DropdownMultiSelect
                  placeholder="Select locations..."
                  searchPlaceholder="Search locations..."
                  searchValue={locationSearch}
                  onSearchChange={setLocationSearch}
                  options={locations.map(l => ({ id: l.id, label: l.name }))}
                  selectedIds={filters.location === 'any' ? [] : filters.location.split('|')}
                  onToggle={toggleLocation}
                  theme={theme}
                />
              </View>

              {/* Developers */}
              <View style={[styles.section, { zIndex: 90 }]}>
                <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginBottom: 16 }]}>
                  Developers
                </Text>

                <DropdownMultiSelect
                  placeholder="Select developers..."
                  searchPlaceholder="Search developers..."
                  searchValue={developerSearch}
                  onSearchChange={setDeveloperSearch}
                  options={developers.map(d => ({ id: d.id, label: d.name }))}
                  selectedIds={filters.developerIds === 'any' ? [] : filters.developerIds.split(',')}
                  onToggle={toggleDeveloper}
                  theme={theme}
                />
              </View>
            </ScrollView>

            {/* Floating Footer Island */}
            <View style={[styles.footerIsland, { borderColor: theme.border, zIndex: 1000 }]}>
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
                    borderWidth: 1,
                    borderColor: 'rgba(255, 59, 48, 0.3)',
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[styles.resetButtonText, { color: '#FF3B30' }]}>
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

function DropdownMultiSelect({
  placeholder,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  options,
  selectedIds,
  onToggle,
  theme
}: any) {
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    triggerLightHaptic();
    setExpanded(!expanded);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Pressable
        onPress={handleToggleExpand}
        style={[
          styles.dropdownHeader,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderBottomLeftRadius: expanded ? 0 : 12,
            borderBottomRightRadius: expanded ? 0 : 12,
          }
        ]}
      >
        <Text style={[
          styles.dropdownPlaceholder,
          { color: selectedIds.length > 0 ? theme.text : theme.textTertiary }
        ]}>
          {selectedIds.length > 0
            ? `${selectedIds.length} selected`
            : placeholder
          }
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>

      {expanded && (
        <View style={[
          styles.dropdownList,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          }
        ]}>
          <View style={[styles.dropdownSearch, { borderBottomColor: theme.border }]}>
            <Ionicons name="search-outline" size={18} color={theme.textTertiary} />
            <TextInput
              style={[styles.dropdownInput, { color: theme.text }]}
              placeholder={searchPlaceholder}
              placeholderTextColor={theme.textTertiary}
              value={searchValue}
              onChangeText={onSearchChange}
            />
          </View>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
            {options.map((option: any) => {
              const isSelected = selectedIds.includes(option.id);
              return (
                <Pressable
                  key={option.id}
                  style={[styles.dropdownOption, { borderBottomColor: theme.border }]}
                  onPress={() => onToggle(option.id)}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    { color: isSelected ? theme.primary : theme.text }
                  ]}>
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              );
            })}
            {options.length === 0 && (
              <View style={styles.emptyResults}>
                <Text style={{ color: theme.textTertiary }}>No results found</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 140,
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
  dropdownContainer: {
    marginBottom: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
  },
  dropdownPlaceholder: {
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 250,
    overflow: 'hidden',
  },
  dropdownSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderBottomWidth: 0.5,
  },
  dropdownInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    height: '100%',
  },
  dropdownScroll: {
    flexGrow: 0,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  dropdownOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyResults: {
    padding: 20,
    alignItems: 'center',
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
