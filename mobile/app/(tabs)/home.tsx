import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Header, SearchBar, PropertyTypeFilter, PropertyCard, PaginationDots, CollectionCard, StatsCard, SmallStatCard, QuickActionCard, NewsCard } from '@/components/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 8;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Apartment']);
  const [currentSlide, setCurrentSlide] = useState(0);

  const properties = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      title: 'Lovely apartment with 2 bedrooms',
      location: 'Downtown Dubai',
      price: '1 300 000$',
      handoverDate: '25 Mar 2027',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      title: 'Modern villa with pool',
      location: 'Palm Jumeirah',
      price: '2 500 000$',
      handoverDate: '15 Jun 2027',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80',
      title: 'Luxury penthouse with view',
      location: 'Dubai Marina',
      price: '3 800 000$',
      handoverDate: '10 Sep 2027',
    },
  ];

  const news = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&auto=format&fit=crop&q=80',
      title: 'Lovely apartment with',
      description: "There've been new things recently brought to the market that you might be interested in checking out",
      timestamp: '3 weeks ago',
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&auto=format&fit=crop&q=80',
      title: 'Lovely apartment with',
      description: "There've been new things recently brought to the market that you might be interested in checking out",
      timestamp: '3 weeks ago',
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&auto=format&fit=crop&q=80',
      title: 'Lovely apartment with',
      description: "There've been new things recently brought to the market that you might be interested in checking out",
      timestamp: '3 weeks ago',
    },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_GAP));
    setCurrentSlide(slideIndex);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header 
          title={t('home.dashboard')}
          avatar="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
        />
        
        <View style={styles.searchSection}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <PropertyTypeFilter 
            selectedTypes={selectedTypes}
            onTypesChange={setSelectedTypes}
          />
        </View>
        
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatsCard
            title={t('home.newLeads')}
            value="12"
            buttonText={t('home.explore')}
            onPress={() => console.log('New Leads pressed')}
          />
          
          <View style={styles.smallStatsRow}>
            <SmallStatCard
              icon="briefcase-outline"
              title={t('home.activeDeals')}
              value="38"
            />
            <SmallStatCard
              icon="cash-outline"
              title={t('home.totalAmount')}
              value="$43M"
            />
          </View>
        </View>
        
        <View style={styles.collectionSection}>
          <CollectionCard
            icon="thumbs-up"
            title={t('home.yourLikedProjects')}
            description={t('home.collectionDescription')}
            gradientImage={require('@/assets/images/gradient-2.png')}
            onPress={() => console.log('Collection pressed 1')}
          />
        </View>
        
        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <QuickActionCard
            icon="people"
            label={t('home.myLeads')}
            onPress={() => router.push('/(tabs)/crm')}
          />
          <QuickActionCard
            icon="home"
            label={t('home.properties')}
            onPress={() => router.push('/(tabs)/properties')}
          />
          <QuickActionCard
            icon="document-text"
            label={t('home.offers')}
            onPress={() => console.log('Offers pressed')}
          />
        </View>
        
        <View style={styles.propertySection}>
          <FlatList
            data={properties}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH }}>
                <PropertyCard
                  image={item.image}
                  title={item.title}
                  location={item.location}
                  price={item.price}
                  handoverDate={item.handoverDate}
                  onPress={() => console.log('Property pressed:', item.id)}
                />
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.flatListContent}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
          />
          
          <View style={styles.dotsContainer}>
            <PaginationDots total={properties.length} current={currentSlide} />
          </View>
        </View>
        
        {/* News Section */}
        <View style={styles.newsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.recentMarketNews')}</Text>
          
          {news.map((item) => (
            <NewsCard
              key={item.id}
              image={item.image}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              onPress={() => console.log('News pressed:', item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor applied dynamically via theme
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  statsSection: {
    paddingHorizontal: 16,
    paddingTop: 0,
    gap: 12,
  },
  smallStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  propertySection: {
    paddingTop: 24,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
  dotsContainer: {
    alignItems: 'center',
  },
  collectionSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  newsSection: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    // color applied dynamically via theme
    marginBottom: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#010312',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
  },
});

