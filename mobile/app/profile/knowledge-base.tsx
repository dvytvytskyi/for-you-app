import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/api/courses';

interface Topic {
  id: string;
  name: string;
}

interface Module {
  id: string;
  title: string;
  author: string;
  completion: number;
  status: 'completed' | 'in-progress' | 'not-started';
  topicId: string;
  isFeatured?: boolean;
  createdAt: string;
}

const TOPICS: Topic[] = [
  { id: 'all', name: 'All' },
  { id: 'intro', name: 'Introduction' },
  { id: 'docs', name: 'Documents' },
  { id: 'ethics', name: 'Investor Ethics' },
];

export default function KnowledgeBaseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['all']);

  // Завантаження курсів з API
  const { data: coursesResponse, isLoading, error } = useQuery({
    queryKey: ['knowledge-base-courses'],
    queryFn: async () => {
      console.log('🔄 Завантаження курсів для knowledge base...');
      try {
        const response = await coursesApi.getAll();
        console.log('✅ Курси завантажено:', response?.data?.length || 0);
        return response;
      } catch (error: any) {
        console.error('❌ Помилка завантаження курсів:', error);
        throw error;
      }
    },
    retry: 1,
  });

  // Конвертуємо курси в формат Module для UI
  const modules = useMemo(() => {
    if (!coursesResponse?.data) {
      return [];
    }

    return coursesResponse.data.map((course) => {
      const apiStatus = course.userProgress?.status || 'NOT_STARTED';
      let uiStatus: 'completed' | 'in-progress' | 'not-started' = 'not-started';

      if (apiStatus === 'COMPLETED') uiStatus = 'completed';
      else if (apiStatus === 'IN_PROGRESS') uiStatus = 'in-progress';

      return {
        id: course.id,
        title: course.title,
        author: 'Made by ForYou Real Estate',
        completion: course.userProgress?.completionPercentage || 0,
        status: uiStatus,
        topicId: 'all',
        createdAt: course.createdAt || new Date().toISOString(),
      };
    });
  }, [coursesResponse]);

  const toggleTopic = (topicId: string) => {
    if (topicId === 'all') {
      setSelectedTopics(['all']);
    } else {
      setSelectedTopics(prev => {
        // Remove 'all' if it was selected
        const withoutAll = prev.filter(t => t !== 'all');

        // Toggle the selected topic
        if (prev.includes(topicId)) {
          const newTopics = withoutAll.filter(t => t !== topicId);
          // If no topics selected, default to 'all'
          return newTopics.length === 0 ? ['all'] : newTopics;
        } else {
          return [...withoutAll, topicId];
        }
      });
    }
  };

  const filteredModules = selectedTopics.includes('all')
    ? modules
    : modules.filter(module => selectedTopics.includes(module.topicId));

  const completedCount = modules.filter(m => m.status === 'completed').length;
  const totalModules = modules.length;
  const overallProgress = totalModules > 0
    ? Math.round((modules.reduce((sum, m) => sum + m.completion, 0) / totalModules))
    : 0;
  const totalPoints = completedCount * 20;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

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
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Knowledge Base</Text>

        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {completedCount}/{totalModules}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Completed
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {overallProgress}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Completed
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {totalPoints}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Points
            </Text>
          </View>
        </View>

        {/* Topics Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.topicsScroll}
          contentContainerStyle={styles.topicsContainer}
        >
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <Pressable
                key={topic.id}
                style={({ pressed }) => [
                  styles.topicButton,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                onPress={() => toggleTopic(topic.id)}
              >
                <Text
                  style={[
                    styles.topicButtonText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.text,
                    },
                  ]}
                >
                  {topic.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Modules List */}
        <View style={styles.modulesContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Loading courses...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={theme.textTertiary} />
              <Text style={[styles.errorText, { color: theme.text }]}>
                Failed to load courses
              </Text>
              <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
                Please try again later
              </Text>
            </View>
          ) : filteredModules.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={48} color={theme.textTertiary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No courses available
              </Text>
            </View>
          ) : (
            filteredModules.map((module) => (
              <Pressable
                key={module.id}
                style={[
                  styles.moduleCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
                onPress={() => router.push(`/profile/module/${module.id}`)}
              >
                <View style={styles.moduleContent}>
                  <Text style={[styles.moduleTitle, { color: theme.text }]} numberOfLines={2}>
                    {module.title}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        module.status === 'completed' ? '#2ECC71' :
                          module.status === 'in-progress' ? '#FFB300' :
                            theme.primary
                    }
                  ]}>
                    <Text style={styles.statusBadgeText}>
                      {module.status === 'completed' ? 'Completed' :
                        module.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                    </Text>
                  </View>
                  <Text style={[styles.moduleAuthor, { color: theme.textSecondary }]}>
                    {module.author} • {formatDate(module.createdAt)}
                  </Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={20} color={theme.textSecondary} />
              </Pressable>
            ))
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
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
  topicsScroll: {
    marginBottom: 16,
  },
  topicsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  topicButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  topicButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modulesContainer: {
    gap: 16,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  moduleContent: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moduleAuthor: {
    fontSize: 12,
    fontWeight: '400',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
  },
});

