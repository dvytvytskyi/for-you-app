import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Pressable, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useQuery } from '@tanstack/react-query';
import { developersApi } from '@/api/developers';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { propertiesApi } from '@/api/properties';
import PropertyCard from '@/components/ui/PropertyCard';
import { convertPropertyToCard, formatPrice } from '@/utils/property-utils';
import { useFavoritesStore } from '@/store/favoritesStore';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DeveloperDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  // Завантаження developer з API
  const { data: developerResponse, isLoading, error } = useQuery({
    queryKey: ['developer', id],
    queryFn: async () => {
      if (!id || typeof id !== 'string') {
        throw new Error('Developer ID is required');
      }
      console.log('🔄 Завантаження developer за ID:', id);
      const response = await developersApi.getById(id);
      console.log('✅ Developer завантажено:', response?.data?.name);
      return response;
    },
    enabled: !!id && typeof id === 'string',
    retry: 1,
  });

  // Завантаження properties девелопера
  const { data: propertiesResponse, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ['developer-properties', id],
    queryFn: async () => {
      if (!id || typeof id !== 'string') return null;
      console.log('🔄 Завантаження об\'єктів девелопера:', id);
      return await propertiesApi.getAll({ developerId: id, limit: 50 });
    },
    enabled: !!id && typeof id === 'string',
  });

  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const developerProperties = propertiesResponse?.data?.data || [];
  const cardProperties = developerProperties.map(p => convertPropertyToCard(p, [])); // Pass favoriteIds if needed, empty for now or fetch from store

  const developer = developerResponse?.data;

  // Валідація URI для зображень
  const getValidImageUri = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return null;
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:') || imageUrl.startsWith('file://')) {
      return imageUrl;
    }
    return null;
  };

  // Форматування дати
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <StatusBar style="light" />
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Developer</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading developer...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !developer) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <StatusBar style="light" />
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.primary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Developer</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Developer not found
          </Text>
          <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>
            {(error as any)?.message || 'The developer could not be loaded'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const logoUri = getValidImageUri(developer.logo);
  const images = developer.images?.filter(img => getValidImageUri(img)) || [];
  const mainImage = images.length > 0 ? images[0] : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.6 : 1 }
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Developer</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Header Info: Logo + Name + Description */}
          <View style={styles.headerInfoContainer}>
            <View style={styles.headerRow}>
              <Text style={[styles.name, { color: theme.text, flex: 1, textAlign: 'left' }]}>
                {developer.name}
              </Text>

              {logoUri ? (
                <Image
                  source={{ uri: logoUri }}
                  style={styles.headerLogo}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.headerLogoPlaceholder, { backgroundColor: theme.primary }]}>
                  <Ionicons name="business" size={32} color="#FFFFFF" />
                </View>
              )}
            </View>

            {developer.description && (
              <Text style={[styles.description, { color: theme.textSecondary, marginTop: 8 }]}>
                {developer.description}
              </Text>
            )}
          </View>

          {/* Gallery (Horizontal) */}
          {images.length > 0 && (
            <View style={styles.gallerySection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryContent}
                style={styles.galleryScroll}
              >
                {images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.galleryCardImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}



          {/* Developer Projects/Properties */}
          <View style={styles.projectsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 16 }]}>
              Projects ({cardProperties.length})
            </Text>

            {isPropertiesLoading ? (
              <ActivityIndicator color={theme.primary} />
            ) : cardProperties.length > 0 ? (
              <View style={styles.projectsList}>
                {cardProperties.map((property) => (
                  <View key={property.id} style={{ marginBottom: 16 }}>
                    <PropertyCard
                      {...property}
                      price={formatPrice(property.price, 'USD')}
                      style={{ height: 280 }}
                      image={property.images[0]}
                      onPress={() => router.push(`/property/${property.id}`)}
                      onToggleFavorite={() => toggleFavorite(property.id)}
                      isFavorite={isFavorite(property.id)}
                      theme={theme}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: theme.textSecondary, fontStyle: 'italic' }}>
                No projects found for this developer.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 300,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  navButtons: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 0, // Reset padding for full width gallery? No, keep padding for text
    paddingTop: 24,
  },
  headerInfoContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Align Name and Logo by bottom
    justifyContent: 'space-between',
    gap: 16,
  },
  headerLogo: {
    width: 60,
    height: 60,
    borderRadius: 12, // Rounded square
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#EFEFEF',
  },
  headerLogoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    paddingTop: 0,
    justifyContent: 'center',
  },
  name: {
    fontSize: 15, // Reduced to 15px
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 15, // Reduced from 18
    fontWeight: '600',
    marginBottom: 12,
  },
  gallerySection: {
    marginBottom: 24,
  },
  galleryScroll: {

  },
  galleryContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  galleryCardImage: {
    width: SCREEN_WIDTH * 0.8, // 80% screen width
    height: 250, // Increased from 200
    borderRadius: 12,
  },
  dateSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  dateText: {
    fontSize: 12,
    fontStyle: 'italic',
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  projectsSection: {
    marginTop: 24,
    marginBottom: 40,
  },
  projectsList: {
    gap: 16,
  },
  errorSubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
});
