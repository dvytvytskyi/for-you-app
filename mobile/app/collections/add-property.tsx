import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Platform,
    TextInput,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView } from 'expo-symbols';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import SearchBar from '@/components/ui/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '@/api/properties';
import { convertPropertyToCard, formatPrice } from '@/utils/property-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useCollectionsStore } from '@/store/collectionsStore';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/user';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface PropertySelectFilters {
    minPrice: number | null;
    maxPrice: number | null;
    location: string;
}

// Extracted Item Component for Animation
const SelectablePropertyItem = React.memo(({
    item,
    isSelected,
    onToggle,
    theme
}: {
    item: ReturnType<typeof convertPropertyToCard>,
    isSelected: boolean,
    onToggle: () => void,
    theme: any
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isSelected) {
            // Bounce animation simulation
            scaleAnim.setValue(0.8);
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 3,
                tension: 100,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(1);
        }
    }, [isSelected, scaleAnim]);

    return (
        <Pressable
            style={[
                styles.propertyItem,
                {
                    backgroundColor: theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                },
            ]}
            onPress={onToggle}
        >
            <View style={styles.propertyItemContent}>
                <View style={styles.propertyInfo}>
                    <Text style={[styles.propertyTitle, { color: theme.text }]} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={[styles.propertyLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                        {item.location}
                    </Text>
                    <Text style={[styles.propertyPrice, { marginTop: 2 }]} numberOfLines={1}>
                        <Text style={{ color: theme.primary, fontWeight: '600' }}>
                            {formatPrice(item.price, 'USD')}
                        </Text>
                        <Text style={{ color: theme.textSecondary, fontWeight: '400' }}>
                            {' • '}
                            {item.bedrooms} {typeof item.bedrooms === 'number' && item.bedrooms === 1 ? 'Bed' : 'Beds'}
                        </Text>
                    </Text>
                </View>

                <Animated.View
                    style={[
                        styles.checkboxWrapper,
                        { transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    {isSelected ? (
                        Platform.OS === 'ios' ? (
                            <SymbolView
                                name="checkmark.circle.fill"
                                tintColor={theme.primary}
                                style={styles.iconSymbol}
                            />
                        ) : (
                            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                        )
                    ) : (
                        Platform.OS === 'ios' ? (
                            <SymbolView
                                name="plus.circle.fill"
                                tintColor={theme.primary}
                                style={styles.iconSymbol}
                            />
                        ) : (
                            <Ionicons name="add-circle" size={24} color={theme.primary} />
                        )
                    )}
                </Animated.View>
            </View>
        </Pressable>
    );
});


export default function AddPropertyScreen() {
    const { theme, isDark } = useTheme(); // destructure isDark
    const { t } = useTranslation();
    const router = useRouter();
    const { collectionId } = useLocalSearchParams();
    const { user } = useAuthStore();

    const isInvestor = user?.role === UserRole.INVESTOR || (user?.role as string) === 'INVESTOR';
    const isAgent = user?.role === UserRole.BROKER || (user?.role as string) === 'BROKER' || (user?.role as string) === 'AGENT';

    // Calculate a visible border color
    // In Dark Mode, theme.border is too dark, so we use a semi-transparent white
    const borderColor = useMemo(() => {
        return isDark ? 'rgba(255,255,255,0.15)' : theme.border;
    }, [isDark, theme.border]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPropertyIds, setSelectedPropertyIds] = useState<Set<string>>(new Set());
    const [filters, setFilters] = useState<PropertySelectFilters>({
        minPrice: null,
        maxPrice: null,
        location: 'any',
    });
    const [showFilters, setShowFilters] = useState(false);

    const [minPriceText, setMinPriceText] = useState('');
    const [maxPriceText, setMaxPriceText] = useState('');

    // Location Dropdown State
    const [locationSearch, setLocationSearch] = useState('');

    const debouncedSearch = useDebounce(searchQuery, 500);

    // Fetch Locations
    const { data: locationsData } = useQuery({
        queryKey: ['locations', locationSearch],
        queryFn: () => propertiesApi.getLocations(locationSearch),
        enabled: showFilters,
    });
    const locations = locationsData || [];

    // Get current collection to check existing IDs
    const collections = useCollectionsStore((state) => state.collections);
    const { addPropertyToCollection } = useCollectionsStore();

    const currentCollection = useMemo(() => {
        const cId = typeof collectionId === 'string' ? collectionId : collectionId?.[0];
        return collections.find(c => c.id === cId);
    }, [collectionId, collections]);

    const existingPropertyIds = useMemo(() => currentCollection?.propertyIds || [], [currentCollection]);

    // Load properties
    const { data: propertiesResponse, isLoading } = useQuery({
        queryKey: ['properties-for-collection-screen', debouncedSearch, filters],
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
                apiFilters.maxPrice = filters.maxPrice;
            }

            const response = await propertiesApi.getProjects({
                ...apiFilters,
                isInvestor,
                isAgent
            });
            return response;
        },
        staleTime: 0,
    });

    const { favoriteIds } = useFavoritesStore();

    const properties = useMemo(() => {
        if (!propertiesResponse?.data?.data) return [];

        const converted = propertiesResponse.data.data
            .map(prop => {
                try {
                    return convertPropertyToCard(prop, favoriteIds);
                } catch (error) {
                    return null;
                }
            })
            .filter((prop): prop is ReturnType<typeof convertPropertyToCard> => prop !== null)
            .filter(prop => !existingPropertyIds.includes(prop.id));

        return converted;
    }, [propertiesResponse, existingPropertyIds, favoriteIds]);

    const filteredProperties = useMemo(() => {
        if (filters.location === 'any') return properties;
        const selectedLocs = filters.location.split('|').filter(Boolean);
        return properties.filter(prop =>
            selectedLocs.some(loc => prop.location.toLowerCase().includes(loc.toLowerCase()))
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

    const handleSelectAll = useCallback(() => {
        const visibleIds = filteredProperties.map(p => p.id);
        const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedPropertyIds.has(id));

        setSelectedPropertyIds(prev => {
            const newSet = new Set(prev);
            if (allSelected) {
                visibleIds.forEach(id => newSet.delete(id));
            } else {
                visibleIds.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    }, [filteredProperties, selectedPropertyIds]);

    const handleAdd = useCallback(() => {
        if (selectedPropertyIds.size > 0 && currentCollection) {
            const propertyIdsArray = Array.from(selectedPropertyIds);

            propertyIdsArray.forEach(id => {
                const prop = properties.find(p => p.id === id);
                const image = prop?.images?.[0] || null;
                addPropertyToCollection(currentCollection.id, id, image);
            });

            router.back();
        }
    }, [selectedPropertyIds, currentCollection, properties, addPropertyToCollection, router]);

    const handleResetFilters = useCallback(() => {
        setFilters({ minPrice: null, maxPrice: null, location: 'any' });
        setSearchQuery('');
        setMinPriceText('');
        setMaxPriceText('');
    }, []);

    const handlePriceChange = (text: string, type: 'min' | 'max') => {
        const rawNumber = parseInt(text.replace(/[^0-9]/g, ''), 10);
        const formatted = isNaN(rawNumber) ? '' : `$${rawNumber.toLocaleString()}`;

        if (type === 'min') {
            setMinPriceText(formatted);
            setFilters(prev => ({ ...prev, minPrice: isNaN(rawNumber) ? null : rawNumber }));
        } else {
            setMaxPriceText(formatted);
            setFilters(prev => ({ ...prev, maxPrice: isNaN(rawNumber) ? null : rawNumber }));
        }
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

    const MemoizedPropertyItem = useCallback(({ item }: { item: ReturnType<typeof convertPropertyToCard> }) => (
        <SelectablePropertyItem
            item={item}
            isSelected={selectedPropertyIds.has(item.id)}
            onToggle={() => togglePropertySelection(item.id)}
            theme={theme}
        />
    ), [selectedPropertyIds, togglePropertySelection, theme]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.backButton,
                        { opacity: pressed ? 0.6 : 1 }
                    ]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="chevron-back" size={22} color={theme.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Add Properties</Text>
                <View style={styles.backButton} />
            </View>

            {/* Search and Filters */}
            <View style={styles.searchSection}>
                <View style={styles.searchBarWrapper}>
                    <SearchBar
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search..."
                    />
                </View>
                <Pressable
                    style={[
                        styles.filterToggleButton,
                        {
                            backgroundColor: showFilters ? theme.primary : theme.card,
                            borderColor: borderColor,
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
                <View style={[styles.filtersPanel, { backgroundColor: theme.card, borderColor: borderColor }]}>
                    {/* Price Range Inputs */}
                    <View style={styles.filterRow}>
                        <View style={[styles.inputContainer, { borderColor: borderColor, backgroundColor: theme.background }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={minPriceText}
                                onChangeText={(text) => handlePriceChange(text, 'min')}
                                placeholder="Min Price"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        </View>
                        <View style={[styles.inputContainer, { borderColor: borderColor, backgroundColor: theme.background }]}>
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                value={maxPriceText}
                                onChangeText={(text) => handlePriceChange(text, 'max')}
                                placeholder="Max Price"
                                placeholderTextColor={theme.textSecondary}
                                keyboardType="numeric"
                                returnKeyType="done"
                            />
                        </View>
                    </View>

                    {/* Location Dropdown */}
                    <DropdownMultiSelect
                        placeholder="Select locations..."
                        searchPlaceholder="Search locations..."
                        searchValue={locationSearch}
                        onSearchChange={setLocationSearch}
                        options={locations.map((l: any) => ({ id: l.name, label: l.name }))}
                        selectedIds={filters.location === 'any' ? [] : filters.location.split('|')}
                        onToggle={toggleLocation}
                        theme={theme}
                        borderColor={borderColor}
                    />

                    {/* Action Buttons */}
                    <View style={styles.filterActionsRow}>
                        <Pressable style={[styles.actionButton, { backgroundColor: theme.background, borderColor: borderColor }]} onPress={handleSelectAll}>
                            <Text style={[styles.actionButtonText, { color: theme.text }]}>
                                {selectedPropertyIds.size > 0 && Array.from(filteredProperties).every(p => selectedPropertyIds.has(p.id))
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </Text>
                        </Pressable>
                        <Pressable style={[styles.actionButton, { backgroundColor: theme.background, borderColor: borderColor }]} onPress={handleResetFilters}>
                            <Text style={[styles.actionButtonText, { color: theme.text }]}>Reset Filters</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* Content */}
            <FlatList
                data={filteredProperties}
                renderItem={({ item }) => <MemoizedPropertyItem item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={64} color={theme.textTertiary} />
                            <Text style={[styles.emptyTitle, { color: theme.text }]}>
                                No properties found
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={isLoading ? <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} /> : null}
            />

            {/* Bottom Actions Island */}
            {selectedPropertyIds.size > 0 && (
                <View style={styles.bottomActionsContainer}>
                    <View style={[styles.bottomActionsIsland, { backgroundColor: theme.background, borderColor: borderColor }]}>
                        <Text style={[styles.selectedCount, { color: theme.text }]}>
                            {selectedPropertyIds.size} selected
                        </Text>
                        <Pressable
                            style={[styles.addButton, { backgroundColor: theme.primary }]}
                            onPress={handleAdd}
                        >
                            <Text style={styles.addButtonText}>Add</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

// Reusable Dropdown Component
function DropdownMultiSelect({
    placeholder,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    options,
    selectedIds,
    onToggle,
    theme,
    borderColor // Passed prop for visibility
}: any) {
    const [expanded, setExpanded] = useState(false);

    return (
        <View style={styles.dropdownContainer}>
            <Pressable
                onPress={() => setExpanded(!expanded)}
                style={[
                    styles.dropdownHeader,
                    {
                        backgroundColor: theme.background,
                        borderColor: borderColor,
                        borderBottomLeftRadius: expanded ? 0 : 8,
                        borderBottomRightRadius: expanded ? 0 : 8,
                    }
                ]}
            >
                <Text style={[
                    styles.dropdownPlaceholder,
                    { color: selectedIds.length > 0 ? theme.text : theme.textSecondary }
                ]}>
                    {selectedIds.length > 0
                        ? `${selectedIds.length} selected`
                        : placeholder
                    }
                </Text>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={theme.textSecondary}
                />
            </Pressable>

            {expanded && (
                <View style={[
                    styles.dropdownList,
                    {
                        backgroundColor: theme.background,
                        borderColor: borderColor,
                    }
                ]}>
                    <View style={[styles.dropdownSearch, { borderBottomColor: borderColor }]}>
                        <Ionicons name="search-outline" size={16} color={theme.textSecondary} />
                        <TextInput
                            style={[styles.dropdownInput, { color: theme.text }]}
                            placeholder={searchPlaceholder}
                            placeholderTextColor={theme.textSecondary}
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
                                    style={[styles.dropdownOption, { borderBottomColor: borderColor }]}
                                    onPress={() => onToggle(option.id)}
                                >
                                    <Text style={[
                                        styles.dropdownOptionText,
                                        { color: isSelected ? theme.primary : theme.text }
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {isSelected && (
                                        <Ionicons name="checkmark" size={18} color={theme.primary} />
                                    )}
                                </Pressable>
                            );
                        })}
                        {options.length === 0 && (
                            <View style={styles.emptyResults}>
                                <Text style={{ color: theme.textSecondary }}>No results found</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
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
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        gap: 12,
        alignItems: 'center',
    },
    searchBarWrapper: {
        flex: 1,
    },
    filterToggleButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
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
        gap: 12,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 12,
    },
    inputContainer: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    input: {
        fontSize: 14,
        height: '100%',
    },
    filterActionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        height: 36,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '500',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    propertyItem: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
        padding: 10,
        gap: 8,
    },
    propertyItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    propertyInfo: {
        flex: 1,
        gap: 2,
        marginRight: 12,
    },
    propertyTitle: {
        fontSize: 15,
        fontWeight: '600',
    },
    propertyLocation: {
        fontSize: 13,
    },
    propertyPrice: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
    checkboxWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconSymbol: {
        width: 24,
        height: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 16,
    },
    bottomActionsContainer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    bottomActionsIsland: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
    },
    selectedCount: {
        fontSize: 15,
        fontWeight: '600',
    },
    addButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    dropdownContainer: {
        // Removed marginBottom to rely on parent gap
    },
    dropdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdownPlaceholder: {
        fontSize: 14,
        fontWeight: '500',
    },
    dropdownList: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        maxHeight: 200,
        overflow: 'hidden',
    },
    dropdownSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 40,
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
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
    },
    dropdownOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    emptyResults: {
        padding: 16,
        alignItems: 'center',
    },
});
