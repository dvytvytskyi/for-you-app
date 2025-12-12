import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import SearchBar from './SearchBar';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/api/properties';
import { convertPropertyToCard, formatPrice } from '@/utils/property-utils';
import { useDebounce } from '@/hooks/useDebounce';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PropertySelectFilters {
  minPrice: number | null;
  maxPrice: number | null;
  location: string;
}

interface AddPropertyToCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  collectionId: string;
  onAddProperties: (propertyIds: string[]) => void;
  existingPropertyIds?: string[];
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

export default function AddPropertyToCollectionModal({
  visible,
  onClose,
  collectionId,
  onAddProperties,
  existingPropertyIds = [],
}: AddPropertyToCollectionModalProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<PropertySelectFilters>({
    minPrice: null,
    maxPrice: null,
    location: 'any',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Завантаження properties з API
  const { data: propertiesResponse, isLoading } = useQuery({
    queryKey: ['properties-for-collection', debouncedSearch, filters],
    queryFn: async () => {
      const apiFilters: any = {
        page: 1,
        limit: 50,
        search: debouncedSearch || undefined,
      };

      if (filters.minPrice) {
        apiFilters.priceFrom = filters.minPrice;
      }
      if (filters.maxPrice) {
        apiFilters.priceTo = filters.maxPrice;
      }

      const response = await propertiesApi.getAll(apiFilters);
      return response;
    },
    enabled: visible,
    staleTime: 0,
  });

  // Конвертуємо properties для UI
  const properties = useMemo(() => {
    console.log('🔄 Processing properties response:', {
      hasResponse: !!propertiesResponse,
      hasData: !!propertiesResponse?.data,
      hasProperties: !!propertiesResponse?.data?.data,
      propertiesCount: propertiesResponse?.data?.data?.length || 0,
      firstProperty: propertiesResponse?.data?.data?.[0] || null,
    });
    
    if (!propertiesResponse?.data?.data) {
      console.warn('⚠️ No properties data in response');
      return [];
    }
    
    const converted = propertiesResponse.data.data
      .map(prop => {
        try {
          return convertPropertyToCard(prop);
        } catch (error: any) {
          console.error('❌ Error converting property to card:', error, prop);
          return null;
        }
      })
      .filter((prop): prop is ReturnType<typeof convertPropertyToCard> => prop !== null)
      .filter(prop => !existingPropertyIds.includes(prop.id)); // Виключаємо вже додані
    
    console.log('✅ Converted properties:', {
      total: converted.length,
      firstConverted: converted[0] || null,
    });
    
    return converted;
  }, [propertiesResponse, existingPropertyIds]);

  // Фільтрація по location (якщо потрібно)
  const filteredProperties = useMemo(() => {
    if (filters.location === 'any') {
      return properties;
    }
    
    // Простий фільтр по location (можна покращити)
    return properties.filter(prop => 
      prop.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }, [properties, filters.location]);

  const togglePropertySelection = useCallback((propertyId: string) => {
    setSelectedPropertyIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(propertyId)) {
        newSet.delete(propertyId);
      } else {
        newSet.add(propertyId);
      }
      return newSet;
    });
  }, []);

  const handleAdd = useCallback(() => {
    if (selectedPropertyIds.size > 0) {
      const propertyIdsArray = Array.from(selectedPropertyIds);
      console.log('✅ Adding properties to collection:', {
        collectionId,
        propertyIds: propertyIdsArray,
        count: propertyIdsArray.length,
      });
      
      onAddProperties(propertyIdsArray);
      setSelectedPropertyIds(new Set());
      onClose();
    } else {
      console.warn('⚠️ No properties selected');
    }
  }, [selectedPropertyIds, onAddProperties, onClose, collectionId]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      location: 'any',
    });
    setSearchQuery('');
  }, []);

  const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 120,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Скидаємо вибір при закритті
      setSelectedPropertyIds(new Set());
      setSearchQuery('');
      setShowFilters(false);
    }
  }, [visible, slideAnim]);

  const renderPropertyItem = ({ item }: { item: ReturnType<typeof convertPropertyToCard> }) => {
    const isSelected = selectedPropertyIds.has(item.id);
    
    return (
      <Pressable
        style={[
          styles.propertyItem,
          {
            backgroundColor: theme.card,
            borderColor: isSelected ? theme.primary : theme.border,
          },
        ]}
        onPress={() => togglePropertySelection(item.id)}
      >
        <View style={styles.propertyItemContent}>
          <View style={styles.propertyInfo}>
            <Text style={[styles.propertyTitle, { color: theme.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.propertyLocation, { color: theme.textSecondary }]} numberOfLines={1}>
              {item.location}
            </Text>
            <Text style={[styles.propertyPrice, { color: theme.primary }]}>
              {formatPrice(item.price, 'USD')}
            </Text>
          </View>
          
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: isSelected ? theme.primary : 'transparent',
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <Ionicons name="chevron-down" size={26} color={theme.text} />
              </Pressable>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                Add Properties
              </Text>
              <View style={styles.closeButton} />
            </View>

            {/* Search and Filters */}
            <View style={styles.searchSection}>
              <View style={styles.searchBarWrapper}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search by property name"
                />
              </View>
              <Pressable
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: showFilters ? theme.primary : theme.card,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={showFilters ? '#FFFFFF' : theme.text}
                />
              </Pressable>
            </View>

            {/* Filters Panel */}
            {showFilters && (
              <View style={[styles.filtersPanel, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {/* Price Range */}
                <View style={styles.filterRow}>
                  <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>
                    Price Range
                  </Text>
                  <View style={styles.priceInputs}>
                    <Pressable
                      style={[
                        styles.priceButton,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => {
                        // TODO: Відкрити модалку вибору мінімальної ціни
                      }}
                    >
                      <Text style={[styles.priceButtonText, { color: filters.minPrice ? theme.text : theme.textSecondary }]}>
                        {filters.minPrice
                          ? PRICE_OPTIONS.find(p => p.value === filters.minPrice)?.label
                          : 'Min Price'}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
                    </Pressable>
                    
                    <Pressable
                      style={[
                        styles.priceButton,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => {
                        // TODO: Відкрити модалку вибору максимальної ціни
                      }}
                    >
                      <Text style={[styles.priceButtonText, { color: filters.maxPrice ? theme.text : theme.textSecondary }]}>
                        {filters.maxPrice
                          ? PRICE_OPTIONS.find(p => p.value === filters.maxPrice)?.label
                          : 'Max Price'}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
                    </Pressable>
                  </View>
                </View>

                {/* Location */}
                <View style={styles.filterRow}>
                  <Text style={[styles.filterLabel, { color: theme.textSecondary }]}>
                    Location
                  </Text>
                  <Pressable
                    style={[
                      styles.locationButton,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => {
                      // TODO: Відкрити модалку вибору локації
                    }}
                  >
                    <Text style={[styles.locationButtonText, { color: filters.location !== 'any' ? theme.text : theme.textSecondary }]}>
                      {filters.location !== 'any'
                        ? DUBAI_LOCATIONS.find(loc => loc.id === filters.location)?.name
                        : 'Any Location'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
                  </Pressable>
                </View>

                {/* Reset Filters */}
                <Pressable
                  style={styles.resetButton}
                  onPress={handleResetFilters}
                >
                  <Ionicons name="reload-outline" size={18} color={theme.textSecondary} />
                  <Text style={[styles.resetButtonText, { color: theme.textSecondary }]}>
                    Reset Filters
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Properties List */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                  Loading properties...
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredProperties}
                renderItem={renderPropertyItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Ionicons name="home-outline" size={64} color={theme.textTertiary} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>
                      No properties found
                    </Text>
                    <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                      Try adjusting your search or filters
                    </Text>
                  </View>
                }
              />
            )}

            {/* Bottom Actions */}
            {selectedPropertyIds.size > 0 && (
              <View style={[styles.bottomActions, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
                <Text style={[styles.selectedCount, { color: theme.text }]}>
                  {selectedPropertyIds.size} selected
                </Text>
                <Pressable
                  style={[styles.addButton, { backgroundColor: theme.primary }]}
                  onPress={handleAdd}
                >
                  <Text style={styles.addButtonText}>
                    Add {selectedPropertyIds.size} {selectedPropertyIds.size === 1 ? 'property' : 'properties'}
                  </Text>
                </Pressable>
              </View>
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
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
    height: SCREEN_HEIGHT * 0.9,
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
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 8,
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersPanel: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  filterRow: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  priceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  priceButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  propertyItem: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    padding: 16,
  },
  propertyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  propertyInfo: {
    flex: 1,
    gap: 4,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  propertyLocation: {
    fontSize: 14,
  },
  propertyPrice: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
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
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 12,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

