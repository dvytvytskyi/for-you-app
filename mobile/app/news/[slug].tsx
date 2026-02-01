import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { useQuery } from '@tanstack/react-query';
import { newsApi, NewsContent } from '@/api/news';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NewsDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams();

  // Завантаження новини з API
  const { data: newsResponse, isLoading, error } = useQuery({
    queryKey: ['news', slug],
    queryFn: async () => {
      if (!slug || typeof slug !== 'string') {
        throw new Error('News slug is required');
      }
      console.log('🔄 Завантаження новини за slug:', slug);
      const response = await newsApi.getBySlug(slug);
      console.log('✅ Новина завантажена:', response?.data?.title);
      return response;
    },
    enabled: !!slug && typeof slug === 'string',
    retry: 1,
  });

  const news = newsResponse?.data;

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

  // Валідація URI для зображення
  const getValidImageUri = (imageUrl: string | null | undefined): string => {
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return 'https://via.placeholder.com/400x300?text=No+Image';
    }
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:') || imageUrl.startsWith('file://')) {
      return imageUrl;
    }
    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  // Сортування контенту за order
  const sortedContents = useMemo(() => {
    if (!news?.contents) return [];
    return [...news.contents].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [news?.contents]);

  // Рендер контенту
  const renderContent = (content: NewsContent, index: number) => {
    switch (content.type) {
      case 'text':
        return (
          <View key={content.id || index} style={styles.contentBlock}>
            {content.title && (
              <Text style={[styles.contentTitle, { color: theme.text }]}>
                {content.title}
              </Text>
            )}
            {content.description && (
              <Text style={[styles.contentText, { color: theme.textSecondary }]}>
                {content.description}
              </Text>
            )}
          </View>
        );

      case 'image':
        return (
          <View key={content.id || index} style={styles.contentBlock}>
            {content.title && (
              <Text style={[styles.contentTitle, { color: theme.text }]}>
                {content.title}
              </Text>
            )}
            {content.imageUrl && (
              <Image
                source={{ uri: getValidImageUri(content.imageUrl) }}
                style={styles.contentImage}
                resizeMode="cover"
              />
            )}
            {content.description && (
              <Text style={[styles.contentCaption, { color: theme.textTertiary }]}>
                {content.description}
              </Text>
            )}
          </View>
        );

      case 'video':
        return (
          <View key={content.id || index} style={styles.contentBlock}>
            {content.title && (
              <Text style={[styles.contentTitle, { color: theme.text }]}>
                {content.title}
              </Text>
            )}
            {content.videoUrl && (
              <View style={[styles.videoPlaceholder, { backgroundColor: theme.card }]}>
                <Ionicons name="play-circle" size={48} color={theme.primary} />
                <Text style={[styles.videoText, { color: theme.textSecondary }]}>
                  Video: {content.videoUrl.substring(0, 50)}...
                </Text>
              </View>
            )}
            {content.description && (
              <Text style={[styles.contentCaption, { color: theme.textTertiary }]}>
                {content.description}
              </Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading news...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !news) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            News not found
          </Text>
          <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>
            {(error as any)?.message || 'The news article could not be loaded'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const mainImage = getValidImageUri(news.imageUrl || news.image);

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
          <Ionicons name="chevron-back" size={22} color={theme.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>News</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Image */}
        {mainImage && (
          <Image
            source={{ uri: mainImage }}
            style={styles.mainImage}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>
            {news.title}
          </Text>

          {/* Date */}
          {news.publishedAt && (
            <Text style={[styles.date, { color: theme.textTertiary }]}>
              {formatDate(news.publishedAt)}
            </Text>
          )}

          {/* Description */}
          {news.description && (
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {news.description}
            </Text>
          )}

          {/* Contents */}
          {sortedContents.length > 0 && (
            <View style={styles.contentsContainer}>
              {sortedContents.map((content, index) => renderContent(content, index))}
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
    paddingBottom: 32,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  contentsContainer: {
    gap: 24,
  },
  contentBlock: {
    gap: 12,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 8,
  },
  contentCaption: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    gap: 8,
  },
  videoText: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
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
    fontSize: 14,
    textAlign: 'center',
  },
});
