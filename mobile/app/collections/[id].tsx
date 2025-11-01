import { View, Text, StyleSheet, Dimensions, Pressable, FlatList, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Header, CollectionPropertyCard } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useMemo, useState, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock data - same as collections screen
interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  propertyCount: number;
  createdDate: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  handoverDate: string;
}

// Mock properties for collections
const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Apartment #12421412',
    description: 'Burj Apartment, Address Bay, Palm Jumeirah offers stunning views and modern amenities in the heart of Dubai.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    price: '1 300 000$',
    handoverDate: '25 Mar 2027',
  },
  {
    id: '2',
    title: 'Apartment #12421412',
    description: 'There\'ve been new things recently built in this area with great facilities and community spaces for families.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
    price: '1 300 000$',
    handoverDate: '25 Mar 2027',
  },
  {
    id: '3',
    title: 'Apartment #12421413',
    description: 'Modern luxury apartment with sea views and premium finishes in a prime location.',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400',
    price: '2 100 000$',
    handoverDate: '15 Jun 2027',
  },
  {
    id: '4',
    title: 'Apartment #12421414',
    description: 'Spacious family apartment near schools and shopping malls with park views.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    price: '890 000$',
    handoverDate: '10 Sep 2027',
  },
];

const MOCK_COLLECTIONS: Collection[] = [
  {
    id: '1',
    title: 'Collection #12024',
    description: 'This collection features premium properties in the heart of Dubai. Burj Apartment offers stunning views of the city skyline, Address Bay properties provide luxury waterfront living.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    propertyCount: 12,
    createdDate: '3 weeks ago',
  },
  {
    id: '2',
    title: 'Collection #4322',
    description: 'Discover elegant villa communities in Dubai Hills and surrounding premium areas. Each villa boasts spacious layouts, private gardens, swimming pools.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    propertyCount: 8,
    createdDate: '2 weeks ago',
  },
  {
    id: '3',
    title: 'Collection #7856',
    description: 'Marina Properties represents the pinnacle of luxury living in Dubai Marina. These stunning residences feature panoramic sea views, modern architecture.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    propertyCount: 15,
    createdDate: '1 month ago',
  },
  {
    id: '4',
    title: 'Collection #9021',
    description: 'Downtown Collection features modern apartments and penthouses in the heart of Dubai. These properties offer breathtaking views of Burj Khalifa.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400',
    propertyCount: 6,
    createdDate: '1 week ago',
  },
  {
    id: '5',
    title: 'Collection #3456',
    description: 'Business Bay presents a comprehensive selection of office spaces and commercial properties designed for success. These modern facilities offer flexible layouts.',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400',
    propertyCount: 9,
    createdDate: '4 days ago',
  },
  {
    id: '6',
    title: 'Collection #6789',
    description: 'Palm Jumeirah Waterfront Collection showcases exclusive properties along one of the world\'s most iconic man-made islands. These residences combine unparalleled luxury.',
    image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=400',
    propertyCount: 20,
    createdDate: '2 months ago',
  },
];

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const [showDescription, setShowDescription] = useState(false);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);

  const collection = useMemo(() => {
    return MOCK_COLLECTIONS.find(c => c.id === id);
  }, [id]);

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const SwipeableItem = ({ item }: { item: Property }) => {
    const panX = useRef(new Animated.Value(0)).current;
    const deleteOpacity = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dx < 0) {
            panX.setValue(gestureState.dx);
            deleteOpacity.setValue(Math.min(Math.abs(gestureState.dx) / 80, 1));
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx < -80) {
            Animated.parallel([
              Animated.spring(panX, {
                toValue: -80,
                useNativeDriver: true,
              }),
              Animated.timing(deleteOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          } else {
            Animated.parallel([
              Animated.spring(panX, {
                toValue: 0,
                useNativeDriver: true,
              }),
              Animated.timing(deleteOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]).start();
          }
        },
      })
    ).current;

    return (
      <View style={styles.swipeableContainer}>
        <Animated.View
          style={[
            styles.deleteButton,
            {
              opacity: deleteOpacity,
            },
          ]}
        >
          <Pressable
            onPress={() => deleteProperty(item.id)}
            style={styles.deleteButtonInner}
          >
            <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          </Pressable>
        </Animated.View>
        <Animated.View
          style={{ transform: [{ translateX: panX }] }}
          {...panResponder.panHandlers}
        >
          <CollectionPropertyCard
            image={item.image}
            title={item.title}
            description={item.description}
            price={item.price}
            handoverDate={item.handoverDate}
            onPress={() => router.push(`/property/${item.id}?fromCollection=${id}`)}
          />
        </Animated.View>
      </View>
    );
  };

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <SwipeableItem item={item} />
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>
          {collection?.title || 'Loading...'}
        </Text>
        <Pressable onPress={() => setShowDescription(!showDescription)}>
          <Text style={[styles.viewDescriptionButton, { color: theme.primary }]}>
            {showDescription ? 'Hide description' : 'View description'}
          </Text>
        </Pressable>
      </View>
      
      {showDescription && (
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {collection?.description || 'Loading...'}
        </Text>
      )}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statHeader}>
            <Text style={[styles.statTitle, { color: theme.primary }]}>VIEWS</Text>
            <View style={[styles.statIcon, { backgroundColor: theme.card }]}>
              <Ionicons name="eye-outline" size={20} color={theme.primary} />
            </View>
          </View>
          <View style={styles.statGraph}>
            <View style={styles.graphBar} />
            <View style={[styles.graphBar, styles.graphBarShort]} />
            <View style={[styles.graphBar, styles.graphBarTall]} />
            <View style={[styles.graphBar, styles.graphBarMedium]} />
            <View style={[styles.graphBar, styles.graphBarTall]} />
            <View style={[styles.graphBar, styles.graphBarMedium]} />
            <View style={styles.graphBar} />
          </View>
          <Text style={[styles.statValue, { color: theme.primary }]}>1,348</Text>
          <Text style={[styles.statPeriod, { color: theme.textSecondary }]}>for last 7 days</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statHeader}>
            <Text style={[styles.statTitle, { color: theme.primary }]}>LIKES</Text>
            <View style={[styles.statIcon, { backgroundColor: theme.card }]}>
              <Ionicons name="heart-outline" size={20} color="#9B59B6" />
            </View>
          </View>
          <View style={styles.statGraph}>
            <View style={styles.graphBar} />
            <View style={[styles.graphBar, styles.graphBarShort]} />
            <View style={[styles.graphBar, styles.graphBarTall]} />
            <View style={[styles.graphBar, styles.graphBarMedium]} />
            <View style={[styles.graphBar, styles.graphBarTall]} />
            <View style={[styles.graphBar, styles.graphBarMedium]} />
            <View style={styles.graphBar} />
          </View>
          <Text style={[styles.statValue, { color: '#9B59B6' }]}>243</Text>
          <Text style={[styles.statPeriod, { color: theme.textSecondary }]}>for last 7 days</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Collection</Text>
        
        <View style={styles.backButton} />
      </View>
      
      <FlatList
        data={properties}
        renderItem={renderPropertyItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '400',
    flex: 1,
  },
  viewDescriptionButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statGraph: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    gap: 4,
  },
  graphBar: {
    flex: 1,
    height: 16,
    backgroundColor: 'rgba(16, 47, 115, 0.2)',
    borderRadius: 2,
  },
  graphBarShort: {
    height: 8,
  },
  graphBarMedium: {
    height: 12,
  },
  graphBarTall: {
    height: 24,
    backgroundColor: 'rgba(155, 89, 182, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  statPeriod: {
    fontSize: 12,
    fontWeight: '400',
  },
  swipeableContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 16,
    zIndex: 1,
  },
  deleteButtonInner: {
    width: 64,
    height: '100%',
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});

