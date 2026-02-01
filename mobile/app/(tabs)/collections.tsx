import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform, Keyboard, LayoutAnimation, ScrollView, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Header, SearchBar, QuickActionCard } from '@/components/ui';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { useCollectionsStore, Collection } from '@/store/collectionsStore';
import { useAuthStore } from '@/store/authStore';
import { triggerLightHaptic } from '@/utils/haptic';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);

export default function CollectionsScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Force blur on screen focus to prevent auto-keyboard
  useFocusEffect(
    useCallback(() => {
      // Small timeout to ensure it runs after any auto-focus attempts
      const timeout = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
        Keyboard.dismiss();
        setIsSearchFocused(false);
      }, 100);
      return () => clearTimeout(timeout);
    }, [])
  );

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Collections store (реактивно)
  const collectionsFromStore = useCollectionsStore((state) => state.collections);
  const {
    createCollection,
    updateCollection,
    deleteCollection
  } = useCollectionsStore();

  // Форматування дати
  const formatDate = useCallback((dateString: string): string => {
    if (!dateString) return 'Just now';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Just now';
    if (diffDays === 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }, []);

  const collections = useMemo(() => {
    console.log('📦 Processing collections from store:', {
      count: collectionsFromStore.length,
      collections: collectionsFromStore.map(c => ({ id: c.id, title: c.title, propertyCount: c.propertyIds.length })),
    });

    // Додаємо propertyCount та formatted date
    return collectionsFromStore.map(c => ({
      ...c,
      propertyCount: c.propertyIds.length,
      createdDate: formatDate(c.createdAt),
      // Якщо є propertyIds, але немає image - намагаємось використати перше зображення або дефолтне
      image: c.image || (c.propertyIds.length > 0
        ? 'https://images.unsplash.com/photo-1600596542815-27b88e31e640?w=400' // Placeholder for collection with items but no cover
        : 'https://via.placeholder.com/400x300?text=No+Properties'),
    }));
  }, [collectionsFromStore, formatDate]);

  const filteredCollections = collections.filter(collection => {
    const title = collection.title || '';
    const description = collection.description || '';
    const search = searchQuery.toLowerCase();

    return title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search);
  });


  const handleCollectionPress = (collectionId: string) => {
    triggerLightHaptic();
    router.push(`/collections/${collectionId}`);
  };

  const closeModal = useCallback(() => {
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
      setModalVisible(false);
      setCollectionName('');
      setCollectionDescription('');
    });
  }, [backdropOpacity, slideAnim]);

  useEffect(() => {
    if (modalVisible) {
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
  }, [modalVisible]);

  const handleSearchFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(true);
  };

  const handleCancelSearch = () => {
    triggerLightHaptic();
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  // Default categories visibility state
  const [showDefaultCategories, setShowDefaultCategories] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('showDefaultCategories').then((value) => {
      if (value !== null) {
        setShowDefaultCategories(JSON.parse(value));
      }
    });
  }, []);

  const handleInfoPress = () => {
    triggerLightHaptic();
    Alert.alert(
      'View Settings',
      'Manage default categories display.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: showDefaultCategories ? "Don't show default categories" : "Show default categories",
          onPress: async () => {
            const newValue = !showDefaultCategories;
            setShowDefaultCategories(newValue);
            await AsyncStorage.setItem('showDefaultCategories', JSON.stringify(newValue));
          },
          style: showDefaultCategories ? 'destructive' : 'default',
        },
      ]
    );
  };

  /* Logic for handling Default Categories Click */
  const handleDefaultCategoryPress = async (label: string) => {
    triggerLightHaptic();
    const existing = collectionsFromStore.find(
      (c) => c.title.trim().toLowerCase() === label.toLowerCase()
    );

    if (existing) {
      router.push(`/collections/${existing.id}`);
    } else {
      try {
        const newCollection = await createCollection(label, `${label} properties`);
        if (newCollection && newCollection.id) {
          // Small delay to ensure store update propagates suitable for navigation if needed
          setTimeout(() => {
            router.push(`/collections/${newCollection.id}`);
          }, 100);
        }
      } catch (error) {
        console.error('Failed to create default collection:', error);
        Alert.alert('Error', 'Could not open collection');
      }
    }
  };

  const handleSave = async () => {
    triggerLightHaptic();
    const trimmedName = collectionName.trim();
    const trimmedDescription = collectionDescription.trim();

    if (!trimmedName || !trimmedDescription) {
      console.warn('⚠️ Collection name or description is empty');
      return;
    }

    console.log('➕ Creating collection:', {
      name: trimmedName,
      description: trimmedDescription,
    });

    try {
      const newCollection = await createCollection(trimmedName, trimmedDescription);

      if (newCollection && newCollection.id) {
        console.log('✅ Collection created:', {
          id: newCollection.id,
          title: newCollection.title,
        });

        closeModal();

        // Невелика затримка перед навігацією, щоб store встиг оновитися
        setTimeout(() => {
          router.push(`/collections/${newCollection.id}`);
        }, 300);
      } else {
        console.error('❌ Created collection has no ID:', newCollection);
      }
    } catch (error) {
      console.error('❌ Error creating collection:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Search Section */}
      <View>
        <View style={styles.searchSection}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              inputRef={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Find collection"
              onFocus={handleSearchFocus}
              autoFocus={false}
            />
          </View>
          {isSearchFocused ? (
            <Pressable onPress={handleCancelSearch} style={{ paddingHorizontal: 4, justifyContent: 'center' }}>
              <Text style={{ color: theme.primary, fontSize: 16 }}>Cancel</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                triggerLightHaptic();
                setModalVisible(true);
              }}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {/* Collections Count & Info */}
        <View style={styles.countContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {collections.length > 0 ? (
              <Text style={[styles.countText, { color: theme.textSecondary }]}>
                {collections.length} {t('tabs.collections.title').toLowerCase()}
              </Text>
            ) : (
              <View />
            )}

            <Pressable onPress={handleInfoPress} hitSlop={10}>
              <Ionicons name="information-circle-outline" size={20} color={theme.textTertiary} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Collections List */}
      <FlatList<MappedCollection>
        data={filteredCollections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        ListHeaderComponent={
          <>
            {showDefaultCategories && (
              <>
                <View style={styles.categoriesGrid}>
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <View key={cat.id} style={styles.categoryItemWrapper}>
                      <QuickActionCard
                        icon={cat.icon}
                        label={cat.label}
                        onPress={() => handleDefaultCategoryPress(cat.label)}
                      />
                    </View>
                  ))}
                </View>
                <View style={[styles.sectionDivider, { backgroundColor: theme.border }]} />
              </>
            )}
          </>
        }
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => handleCollectionPress(item.id)}
            theme={theme}
          />
        )}
        ListFooterComponent={null}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-outline" size={64} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {t('tabs.collections.noCollections')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {t('tabs.collections.createYourFirst')}
            </Text>
          </View>
        }
      />

      {/* Create Collection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View
            style={[
              styles.modalBackdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />

          {/* Content */}
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                paddingTop: insets.top, // Dynamic safe area
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [SCREEN_WIDTH, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContentWrapper}
            >
              {/* Header */}
              <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                <Pressable
                  style={({ pressed }) => [
                    styles.closeButton,
                    { opacity: pressed ? 0.6 : 1 }
                  ]}
                  onPress={() => {
                    triggerLightHaptic();
                    closeModal();
                  }}
                >
                  <Ionicons name="chevron-back" size={22} color={theme.primary} />
                </Pressable>

                <Text style={[styles.modalTitle, { color: theme.text }]}>Create Collection</Text>

                <View style={styles.closeButton} />
              </View>

              {/* Form */}
              <ScrollView
                style={styles.modalForm}
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    Name
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    value={collectionName}
                    onChangeText={setCollectionName}
                    placeholder="Enter collection name"
                    placeholderTextColor={theme.textTertiary}
                    autoFocus={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                    Description
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    value={collectionDescription}
                    onChangeText={setCollectionDescription}
                    placeholder="Enter collection description"
                    placeholderTextColor={theme.textTertiary}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </ScrollView>

              {/* Footer Island */}
              <View style={styles.footerContainer}>
                <View style={[styles.footerBackground, { backgroundColor: theme.card }]}>
                  <BlurView
                    intensity={100}
                    tint={isDark ? 'dark' : 'light'}
                    style={styles.footer}
                  >
                    <Pressable
                      style={({ pressed }) => [
                        styles.cancelButton,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.card + 'CC',
                          transform: [{ scale: pressed ? 0.96 : 1 }],
                          opacity: pressed ? 0.7 : 1,
                        }
                      ]}
                      onPress={() => {
                        triggerLightHaptic();
                        closeModal();
                      }}
                    >
                      <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.saveButton,
                        {
                          backgroundColor: theme.primary,
                          transform: [{ scale: pressed ? 0.96 : 1 }],
                          opacity: pressed ? 0.8 : 1,
                        },
                      ]}
                      onPress={handleSave}
                    >
                      <Text style={styles.saveButtonText}>Save</Text>
                    </Pressable>
                  </BlurView>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface MappedCollection extends Collection {
  propertyCount: number;
  createdDate: string;
}

interface CollectionCardProps {
  collection: MappedCollection;
  onPress: () => void;
  theme: any;
}

function CollectionCard({ collection, onPress, theme }: CollectionCardProps) {
  // Mock data for display until backend update
  const mockProjects = ['Sunrise Bay', 'Beach Isle', 'Marina Vista', 'Emaar Beachfront'];
  const mockStats = {
    totalValue: '$1,250,000',
    avgPrice: '$416,000',
    rooms: '1, 2, 3'
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.collectionCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }]
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.collectionTitle, { color: theme.text }]} numberOfLines={1}>
          {collection.title}
        </Text>
        <Text style={[styles.collectionDate, { color: theme.textTertiary }]}>
          {collection.createdDate}
        </Text>
      </View>

      <Text style={[styles.projectsList, { color: theme.textSecondary }]} numberOfLines={2}>
        {collection.description || mockProjects.join(', ')}...
      </Text>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Total Value</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{mockStats.totalValue}</Text>
        </View>
        <View style={styles.statVerticalDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Avg Price</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{mockStats.avgPrice}</Text>
        </View>
        <View style={styles.statVerticalDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.textTertiary }]}>Rooms</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{mockStats.rooms}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const DEFAULT_CATEGORIES = [
  { id: 'investment', label: 'Investment', icon: 'trending-up-outline' as const },
  { id: 'families', label: 'Families', icon: 'people-outline' as const },
  { id: 'low_budget', label: 'Low Budget', icon: 'wallet-outline' as const },
  { id: 'mid_budget', label: 'Mid Budget', icon: 'briefcase-outline' as const },
  { id: 'high_end', label: 'High End', icon: 'diamond-outline' as const },
  { id: 'popular', label: 'Popular', icon: 'star-outline' as const },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  countText: {
    fontSize: 14,
    fontWeight: '400',
  },
  listContent: {
    paddingHorizontal: CARD_PADDING,
    paddingBottom: 100,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  categoryItemWrapper: {
    width: (SCREEN_WIDTH - (CARD_PADDING * 2) - 24) / 3, // 3 columns with 12px gap
    height: (SCREEN_WIDTH - (CARD_PADDING * 2) - 24) / 3, // Square
  },
  sectionDivider: {
    height: 1,
    marginBottom: 20,
    width: '100%',
  },
  collectionCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  collectionDate: {
    fontSize: 12,
  },
  projectsList: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  statVerticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E5', // Will override with theme border
  },
  collectionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  endContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  endText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentWrapper: {
    flex: 1,
  },
  modalContent: {
    width: '100%',
    height: '100%',
    // paddingTop removed (handled dynamically)
    paddingBottom: 40,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalForm: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    paddingTop: 8,
  },
  footerBackground: {
    borderRadius: 999,
    opacity: 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
