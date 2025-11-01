import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useState } from 'react';

interface Topic {
  id: string;
  name: string;
}

interface Module {
  id: string;
  title: string;
  author: string;
  completion: number;
  status: 'completed' | 'in-progress';
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

const MOCK_MODULES: Module[] = [
  {
    id: '1',
    title: 'Introduction to Dubai Market',
    author: 'Made by ForYou Real Estate',
    completion: 84,
    status: 'completed',
    topicId: 'intro',
    isFeatured: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Documents, signing them etc.',
    author: 'Made by ForYou Real Estate',
    completion: 100,
    status: 'completed',
    topicId: 'docs',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    title: 'Documents, signing them etc.',
    author: 'Made by ForYou Real Estate',
    completion: 40,
    status: 'in-progress',
    topicId: 'docs',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    title: 'Documents, signing them etc.',
    author: 'Made by ForYou Real Estate',
    completion: 40,
    status: 'in-progress',
    topicId: 'docs',
    createdAt: '2024-04-05',
  },
  {
    id: '5',
    title: 'Documents, signing them etc.',
    author: 'Made by ForYou Real Estate',
    completion: 0,
    status: 'in-progress',
    topicId: 'docs',
    createdAt: '2024-05-12',
  },
];

export default function KnowledgeBaseScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['all']);

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
    ? MOCK_MODULES
    : MOCK_MODULES.filter(module => selectedTopics.includes(module.topicId));

  const completedCount = MOCK_MODULES.filter(m => m.status === 'completed').length;
  const totalModules = MOCK_MODULES.length;
  const overallProgress = Math.round((MOCK_MODULES.reduce((sum, m) => sum + m.completion, 0) / MOCK_MODULES.length));
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
          <Ionicons name="chevron-back" size={20} color={theme.text} />
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
              Points Earned
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
          {filteredModules.map((module, index) => (
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
                  { backgroundColor: module.status === 'completed' ? '#4CAF50' : '#FF9800' }
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {module.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
                <Text style={[styles.moduleAuthor, { color: theme.textSecondary }]}>
                  {module.author} • {formatDate(module.createdAt)}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={theme.textSecondary} />
            </Pressable>
          ))}
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
    fontSize: 16,
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
});

