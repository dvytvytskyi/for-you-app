import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform, Keyboard, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Header, SearchBar } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { useCollectionsStore, Collection } from '@/store/collectionsStore';
import { useAuthStore } from '@/store/authStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - (CARD_PADDING * 2) - CARD_GAP) / 2;

export default function CollectionsScreen() {
  const { theme } = useTheme();
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
    createCollection: createCollectionInStore,
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
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSave = async () => {
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
      const newCollection = await createCollectionInStore(trimmedName, trimmedDescription);

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
      {/* Header and Search */}
      <View>
        <Header
          title={t('tabs.collections.title')}
          titleColor="#FFFFFF"
          titleSize={20}
          titleWeight="600"
          user={user || undefined}
          avatar={user?.avatar}
        />

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
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </Pressable>
          )}
        </View>

        {/* Collections Count */}
        {collections.length > 0 && (
          <View style={styles.countContainer}>
            <Text style={[styles.countText, { color: theme.textSecondary }]}>
              {collections.length} {t('tabs.collections.title').toLowerCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Collections Grid */}
      <FlatList<MappedCollection>
        data={filteredCollections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        numColumns={2}
        columnWrapperStyle={styles.row}
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
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: '#FFFFFF' }]}>
                  Create Collection
                </Text>
                <Pressable onPress={closeModal}>
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </Pressable>
              </View>

              {/* Form */}
              <View style={styles.modalForm}>
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
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                  onPress={closeModal}
                >
                  <Text style={[styles.modalButtonText, { color: theme.textSecondary }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.primary }]}
                  onPress={handleSave}
                >
                  <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                    Save
                  </Text>
                </Pressable>
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
  return (
    <Pressable
      style={({ pressed }) => [
        styles.collectionCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }]
        }
      ]}
      onPress={onPress}
    >
      <Image
        source={{
          uri: collection.image && collection.image.trim().length > 0
            ? collection.image
            : 'https://via.placeholder.com/400x300?text=No+Image'
        }}
        style={styles.collectionImage}
        defaultSource={require('@/assets/images/gradient-1.png')}
      />
      <View style={styles.collectionContent}>
        <Text style={[styles.collectionTitle, { color: theme.text }]} numberOfLines={2}>
          {collection.title}
        </Text>
        <Text style={[styles.collectionDescription, { color: theme.textSecondary }]} numberOfLines={2}>
          {collection.description}
        </Text>
        <Text style={[styles.collectionDate, { color: theme.textTertiary }]}>
          Created {collection.createdDate}
        </Text>
      </View>
    </Pressable>
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
    paddingBottom: 16,
  },
  row: {
    gap: CARD_GAP,
  },
  collectionCard: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: CARD_GAP,
  },
  collectionImage: {
    width: '100%',
    height: 120,
  },
  collectionContent: {
    padding: 12,
    gap: 4,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  collectionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  collectionDate: {
    fontSize: 11,
    marginTop: 4,
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
    paddingTop: 60,
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
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  modalForm: {
    paddingHorizontal: 20,
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    borderWidth: 0,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
