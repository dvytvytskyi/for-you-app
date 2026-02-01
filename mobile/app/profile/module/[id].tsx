import { View, Text, StyleSheet, ScrollView, Pressable, Image, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { coursesApi, CourseContent, CourseLink } from '@/api/courses';
import { BlurView } from 'expo-blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('NOT_STARTED');
  const [isUpdating, setIsUpdating] = useState(false);

  // Завантаження курсу з API
  const { data: courseResponse, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id || typeof id !== 'string') {
        throw new Error('Course ID is required');
      }
      console.log('🔄 Завантаження курсу за ID:', id);
      const response = await coursesApi.getById(id);
      console.log('✅ Курс завантажено:', response?.data?.title);
      return response;
    },
    enabled: !!id && typeof id === 'string',
    retry: 1,
  });

  // Синхронізація локального статусу з даними з API
  useMemo(() => {
    if (courseResponse?.data?.userProgress?.status) {
      setStatus(courseResponse.data.userProgress.status);
    }
  }, [courseResponse?.data]);

  const course = courseResponse?.data;

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getProgressPercentage = () => {
    if (course?.userProgress?.completionPercentage !== undefined && status === course?.userProgress?.status) {
      return course.userProgress.completionPercentage;
    }
    switch (status) {
      case 'NOT_STARTED':
        return 0;
      case 'IN_PROGRESS':
        return 50;
      case 'COMPLETED':
        return 100;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'NOT_STARTED':
        return 'Not Started';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
    }
  };

  const handleStatusChange = async () => {
    if (isUpdating) return;

    let nextStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'NOT_STARTED';
    if (status === 'NOT_STARTED') {
      nextStatus = 'IN_PROGRESS';
    } else if (status === 'IN_PROGRESS') {
      nextStatus = 'COMPLETED';
    } else {
      return; // Вже завершено
    }

    try {
      setIsUpdating(true);
      await coursesApi.updateProgress(id as string, nextStatus);
      setStatus(nextStatus);
      // Оновлюємо дані в кеші
      courseResponse?.refetch && courseResponse.refetch();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const progress = getProgressPercentage();

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

        <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
          Knowledge Base
        </Text>

        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 140 }]}
      >
        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View style={[
              styles.progressBarFilled,
              {
                width: `${progress}%`,
                backgroundColor: theme.primary
              }
            ]} />
            <View style={[
              styles.progressBarEmpty,
              {
                width: `${100 - progress}%`,
                backgroundColor: theme.backgroundSecondary
              }
            ]} />
          </View>
          <Text style={[styles.progressText, { color: theme.textSecondary }]}>
            {progress}% done, {100 - progress}% left
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading course...
            </Text>
          </View>
        ) : error || !course ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={theme.textTertiary} />
            <Text style={[styles.errorTitle, { color: theme.text }]}>
              Course not found
            </Text>
            <Text style={[styles.errorSubtitle, { color: theme.textSecondary }]}>
              {(error as any)?.message || 'The course could not be loaded'}
            </Text>
          </View>
        ) : (
          <>
            {/* Metadata */}
            {course.createdAt && (
              <Text style={[styles.metadata, { color: theme.textSecondary }]}>
                Created {formatDate(course.createdAt)}
              </Text>
            )}

            {/* Title */}
            <Text style={[styles.title, { color: theme.primary }]}>
              {course.title}
            </Text>

            {/* Description */}
            {course.description && (
              <Text style={[styles.description, { color: theme.text }]}>
                {course.description}
              </Text>
            )}

            {/* Content Blocks */}
            {course.contents && course.contents.length > 0 && (
              <>
                {course.contents.map((content, index) => (
                  <View key={content.id || index} style={styles.blockContainer}>
                    {content.type === 'text' && (
                      <>
                        {content.title && (
                          <Text style={[styles.blockTitle, { color: theme.primary }]}>
                            {content.title}
                          </Text>
                        )}
                        {content.description && (
                          <Text style={[styles.blockDescription, { color: theme.text }]}>
                            {content.description}
                          </Text>
                        )}
                      </>
                    )}
                    {content.type === 'image' && (
                      <>
                        {content.title && (
                          <Text style={[styles.blockTitle, { color: theme.primary }]}>
                            {content.title}
                          </Text>
                        )}
                        {content.imageUrl && (
                          <Image
                            source={{ uri: getValidImageUri(content.imageUrl) }}
                            style={styles.image}
                            resizeMode="cover"
                          />
                        )}
                        {content.description && (
                          <Text style={[styles.blockCaption, { color: theme.textSecondary }]}>
                            {content.description}
                          </Text>
                        )}
                      </>
                    )}
                    {content.type === 'video' && (
                      <>
                        {content.title && (
                          <Text style={[styles.blockTitle, { color: theme.primary }]}>
                            {content.title}
                          </Text>
                        )}
                        {content.videoUrl && (
                          <Pressable
                            style={[styles.videoContainer, { backgroundColor: theme.card }]}
                            onPress={() => Linking.openURL(content.videoUrl!)}
                          >
                            <Ionicons name="play-circle" size={64} color={theme.primary} />
                            <Text style={[styles.videoText, { color: theme.textSecondary }]}>
                              Tap to play video
                            </Text>
                          </Pressable>
                        )}
                        {content.description && (
                          <Text style={[styles.blockCaption, { color: theme.textSecondary }]}>
                            {content.description}
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                ))}
              </>
            )}

            {/* Useful Links */}
            {course.links && course.links.length > 0 && (
              <View style={styles.linksContainer}>
                <Text style={[styles.linksTitle, { color: theme.primary }]}>
                  Useful Links
                </Text>
                {course.links.map((link, index) => (
                  <Pressable
                    key={link.id || index}
                    style={[styles.linkItem, { borderBottomColor: theme.border }]}
                    onPress={() => Linking.openURL(link.url)}
                  >
                    <Text style={[styles.linkText, { color: theme.text }]}>
                      {link.title}
                    </Text>
                    <Ionicons name="open-outline" size={20} color={theme.textSecondary} />
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Floating Status Button */}
      <Pressable
        style={({ pressed }) => [
          styles.statusButton,
          {
            position: 'absolute',
            bottom: 40,
            left: 40,
            right: 40,
            backgroundColor: status === 'COMPLETED' ? '#2ECC71' : (status === 'IN_PROGRESS' ? '#FFB300' : theme.primary),
            height: 52,
            borderRadius: 22,
            opacity: (status === 'COMPLETED' || isUpdating) ? 1 : (pressed ? 0.8 : 1),
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 5,
            zIndex: 100,
          }
        ]}
        onPress={handleStatusChange}
        disabled={status === 'COMPLETED' || isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={[styles.statusButtonText, { fontSize: 13, fontWeight: '600', color: '#FFFFFF' }]}>
            {status === 'COMPLETED' ? 'Completed' : `Mark as ${status === 'NOT_STARTED' ? 'In Progress' : 'Completed'}`}
          </Text>
        )}
      </Pressable>
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
  content: {
    padding: 16,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFilled: {
    height: '100%',
  },
  progressBarEmpty: {
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '400',
  },
  metadata: {
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  blockContainer: {
    marginBottom: 24,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  blockDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  linksContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  linksTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
  },
  statusButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
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
  blockCaption: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
  },
  videoText: {
    fontSize: 12,
    marginTop: 8,
  },
});
