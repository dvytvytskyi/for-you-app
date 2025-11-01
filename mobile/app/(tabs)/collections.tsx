import { View, Text, StyleSheet, FlatList, Pressable, Image, ActivityIndicator, Dimensions, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Header, SearchBar } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - (CARD_PADDING * 2) - CARD_GAP) / 2;

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  propertyCount: number;
  createdDate: string;
}

// Mock data
const MOCK_COLLECTIONS: Collection[] = [
  {
    id: '1',
    title: 'Collection #12024',
    description: 'Burj Apartment, Address Bay, Palm...',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    propertyCount: 12,
    createdDate: '3 weeks ago',
  },
  {
    id: '2',
    title: 'Collection #4322',
    description: 'Villa Collection, Dubai Hills...',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    propertyCount: 8,
    createdDate: '2 weeks ago',
  },
  {
    id: '3',
    title: 'Collection #7856',
    description: 'Marina Properties, Luxury...',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    propertyCount: 15,
    createdDate: '1 month ago',
  },
  {
    id: '4',
    title: 'Collection #9021',
    description: 'Downtown Collection, Modern...',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    propertyCount: 6,
    createdDate: '1 week ago',
  },
  {
    id: '5',
    title: 'Collection #3456',
    description: 'Business Bay, Office Spaces...',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400',
    propertyCount: 9,
    createdDate: '4 days ago',
  },
  {
    id: '6',
    title: 'Collection #6789',
    description: 'Palm Jumeirah, Waterfront...',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400',
    propertyCount: 20,
    createdDate: '2 months ago',
  },
];

export default function CollectionsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newCollections: Collection[] = [
      {
        id: `${collections.length + 1}`,
        title: 'Collection #2341',
        description: 'Dynamic Collection, Added...',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
        propertyCount: 5,
        createdDate: 'Just now',
      },
      {
        id: `${collections.length + 2}`,
        title: 'Collection #5678',
        description: 'Luxury Collection, Premium...',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
        propertyCount: 11,
        createdDate: 'Yesterday',
      },
    ];
    
    setCollections(prev => [...prev, ...newCollections]);
    setLoading(false);
    
    if (collections.length >= 8) {
      setHasMore(false);
    }
  };

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

  const handleSave = () => {
    if (collectionName.trim() && collectionDescription.trim()) {
      const newCollection: Collection = {
        id: `${collections.length + 1}`,
        title: collectionName,
        description: collectionDescription,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
        propertyCount: 0,
        createdDate: 'Just now',
      };
      setCollections(prev => [newCollection, ...prev]);
      closeModal();
      router.push(`/collections/${newCollection.id}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header and Search */}
      <View>
        <Header 
          title={t('tabs.collections.title')}
          avatar="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
        />
        
        <View style={styles.searchSection}>
          <View style={styles.searchBarWrapper}>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Find property"
            />
          </View>
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
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
      <FlatList
        data={filteredCollections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <CollectionCard
            collection={item}
            onPress={() => handleCollectionPress(item.id)}
            theme={theme}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : !hasMore && filteredCollections.length > 0 ? (
            <View style={styles.endContainer}>
              <Text style={[styles.endText, { color: theme.textTertiary }]}>
                No more collections to load
              </Text>
            </View>
          ) : null
        }
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
              <Text style={[styles.modalTitle, { color: theme.primary }]}>
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

interface CollectionCardProps {
  collection: Collection;
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
        source={{ uri: collection.image }}
        style={styles.collectionImage}
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
    fontSize: 28,
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
