import { View, Text, StyleSheet, ScrollView, Pressable, Image, Linking, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video';
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: 'not-started' | 'in-progress' | 'completed';
  contentBlocks: ContentBlock[];
  usefulLinks?: Array<{ title: string; url: string }>;
}

const MOCK_MODULES: Module[] = [
  {
    id: '1',
    title: 'Introduction to Dubai Market',
    description: 'This section made to create post-title scenario. It\'s a short description.',
    createdAt: '2024-01-15',
    status: 'in-progress',
    contentBlocks: [
      {
        id: '1',
        type: 'text',
        title: 'Title #1 made here',
        description: 'An anti-detect browser (also known as a multi-profile or multi-accounting browser) is a specially modified browser that allows you to change or mask the user\'s digital fingerprint (browser fingerprint), IP address, language, time zone, geolocation, WebGL/WebRTC characteristics, font list, User-Agent, and other parameters.',
      },
      {
        id: '2',
        type: 'image',
        title: 'Architecture in Dubai',
        imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: '3',
        type: 'text',
        title: 'Title #2 made here',
        description: 'An anti-detect browser (also known as a multi-profile or multi-accounting browser) is a specially modified browser that allows you to change or mask the user\'s digital fingerprint.',
      },
    ],
    usefulLinks: [
      { title: 'Dubai Real Estate Guide', url: 'https://example.com' },
      { title: 'Investment Tips', url: 'https://example.com' },
    ],
  },
];

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');

  const module = MOCK_MODULES.find(m => m.id === id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getProgressPercentage = () => {
    switch (status) {
      case 'not-started':
        return 0;
      case 'in-progress':
        return 76;
      case 'completed':
        return 100;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'not-started':
        return 'Not Started';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
    }
  };

  const handleStatusChange = () => {
    if (status === 'not-started') {
      setStatus('in-progress');
    } else if (status === 'in-progress') {
      setStatus('completed');
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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Course {id}</Text>
        
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 100 }]}
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

        {/* Metadata */}
        <Text style={[styles.metadata, { color: theme.textSecondary }]}>
          Created {module?.createdAt ? formatDate(module.createdAt) : ''}
        </Text>

        {/* Title */}
        <Text style={[styles.title, { color: theme.primary }]}>
          {module?.title}
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.text }]}>
          {module?.description}
        </Text>

        {/* Content Blocks */}
        {module?.contentBlocks.map((block) => (
          <View key={block.id} style={styles.blockContainer}>
            {block.type === 'text' && (
              <>
                <Text style={[styles.blockTitle, { color: theme.primary }]}>
                  {block.title}
                </Text>
                {block.description && (
                  <Text style={[styles.blockDescription, { color: theme.text }]}>
                    {block.description}
                  </Text>
                )}
              </>
            )}
            {block.type === 'image' && block.imageUrl && (
              <>
                {block.title && (
                  <Text style={[styles.blockTitle, { color: theme.primary }]}>
                    {block.title}
                  </Text>
                )}
                <Image
                  source={{ uri: block.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </>
            )}
            {block.type === 'video' && block.videoUrl && (
              <>
                {block.title && (
                  <Text style={[styles.blockTitle, { color: theme.primary }]}>
                    {block.title}
                  </Text>
                )}
                <Pressable
                  style={styles.videoContainer}
                  onPress={() => Linking.openURL(block.videoUrl!)}
                >
                  <Ionicons name="play-circle" size={64} color={theme.primary} />
                </Pressable>
              </>
            )}
          </View>
        ))}

        {/* Useful Links */}
        {module?.usefulLinks && module.usefulLinks.length > 0 && (
          <View style={styles.linksContainer}>
            <Text style={[styles.linksTitle, { color: theme.primary }]}>
              Useful Links
            </Text>
            {module.usefulLinks.map((link, index) => (
              <Pressable
                key={index}
                style={styles.linkItem}
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
      </ScrollView>

      {/* Fixed Status Button */}
      <View style={[styles.bottomButtonContainer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        <Pressable
          style={[
            styles.statusButton,
            {
              backgroundColor: theme.primary,
              opacity: status === 'completed' ? 0.5 : 1
            }
          ]}
          onPress={handleStatusChange}
          disabled={status === 'completed'}
        >
          <Text style={styles.statusButtonText}>
            {status === 'completed' ? 'Completed' : `Mark as ${status === 'not-started' ? 'In Progress' : 'Completed'}`}
          </Text>
        </Pressable>
      </View>
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
});
