import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { developersApi } from '@/api/developers';
import { DeveloperCard } from '@/components/ui';

export default function DevelopersScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Завантаження developers з API
  const { data: developersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['developers'],
    queryFn: async () => {
      console.log('🔄 Завантаження developers...');
      try {
        const response = await developersApi.getAll();
        console.log('✅ Developers завантажено:', response?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження developers:', error);
        throw error;
      }
    },
    retry: 1,
  });

  // ID тестових девелоперів, які мають бути першими
  const priorityDeveloperIds = [
    '155eaa8e-3708-449a-8348-16d25d0cf318', // Emaar Properties
    '15c2c5bc-f653-4991-9220-aa2699b2b8e7', // DAMAC Properties
  ];

  // Фільтруємо: тільки ті, що мають лого
  const filteredDevelopers = developersResponse?.data?.filter(d => !!d.logo) || [];

  // Сортуємо: спочатку пріоритетні, потім решта
  const developers = [...filteredDevelopers].sort((a, b) => {
    const aIndex = priorityDeveloperIds.indexOf(a.id);
    const bIndex = priorityDeveloperIds.indexOf(b.id);

    // Якщо обидва в пріоритетних - зберігаємо порядок
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // Якщо тільки a в пріоритетних - він перший
    if (aIndex !== -1) return -1;
    // Якщо тільки b в пріоритетних - він перший
    if (bIndex !== -1) return 1;
    // Інакше зберігаємо оригінальний порядок
    return 0;
  });

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
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Developers</Text>
        <View style={styles.backButton} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading developers...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Error loading developers
          </Text>
          <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>
            {(error as any)?.message || 'Unknown error'}
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : developers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No developers available
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Check back later for updates
          </Text>
        </View>
      ) : (
        <FlatList
          data={developers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DeveloperCard
              logo={item.logo}
              name={item.name}
              description={item.description}
              projectsCount={item.projectsCount.total}
              gradientImage={require('@/assets/images/gradient-2.png')}
              onPress={() => router.push(`/developers/${item.id}`)}
            />
          )}
        />
      )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 6,
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
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
});
