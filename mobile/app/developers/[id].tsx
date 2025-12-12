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
            <Ionicons name="chevron-back" size={24} color={theme.text} />
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
            <Ionicons name="chevron-back" size={24} color={theme.text} />
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
          <Ionicons name="chevron-back" size={24} color={theme.text} />
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
          {/* Logo and Name */}
          <View style={styles.logoSection}>
            {logoUri ? (
              <Image
                source={{ uri: logoUri }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: theme.primary }]}>
                <Ionicons name="business" size={32} color="#FFFFFF" />
              </View>
            )}
            <Text style={[styles.name, { color: theme.text }]}>
              {developer.name}
            </Text>
          </View>

          {/* Description */}
          {developer.description && (
            <View style={styles.descriptionSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                {developer.description}
              </Text>
            </View>
          )}

          {/* Gallery */}
          {images.length > 0 && (
            <View style={styles.gallerySection}>
              <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 12 }]}>
                Gallery
              </Text>
              <View style={styles.galleryList}>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          )}

          {/* Created Date */}
          {developer.createdAt && (
            <View style={styles.dateSection}>
              <Text style={[styles.dateText, { color: theme.textTertiary }]}>
                Added: {formatDate(developer.createdAt)}
              </Text>
            </View>
          )}
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
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
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    maxWidth: 200,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
  },
  gallerySection: {
    marginBottom: 24,
  },
  galleryList: {
    gap: 12,
  },
  galleryImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  dateSection: {
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
  errorSubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
});
