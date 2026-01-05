import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Animated, ActivityIndicator, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads';

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();

  const [activityVisible, setActivityVisible] = useState(false);
  const [activityScrollAnim] = useState(new Animated.Value(1));
  const [activityBackdropOpacity] = useState(new Animated.Value(0));

  // Fetch real lead data from live AmoCRM endpoint
  const { data: leadData, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.getById(id as string),
    enabled: !!id,
  });

  const currentLead = leadData?.lead;
  const notes = leadData?.notes || [];
  const events = leadData?.events || [];

  const stage = useMemo(() => {
    return {
      label: currentLead?.statusName || currentLead?.status || 'Unknown',
      color: '#2196F3', // Default blue
      value: currentLead?.status
    };
  }, [currentLead?.status, currentLead?.statusName]);

  // ... (formatPrice remains same)

  // Combined Timeline Data
  const timelineData = useMemo(() => {
    const combined = [
      ...notes.map(n => ({ ...n, _type: 'note' })),
      ...events.map(e => ({ ...e, _type: 'event' }))
    ];
    // Sort by created_at descending (newest first)
    return combined.sort((a, b) => b.created_at - a.created_at);
  }, [notes, events]);

  const formatTimelineDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // ... (useEffect, callbacks remain same)

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !currentLead) {
    // ... (Error view remains same)
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Error</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.textSecondary }}>Lead not found or error loading.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* ... (Header and Main ScrollView content - Blocks 1, 2, 3, 4 remain mostly same, as they used currentLead) */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Lead Details</Text>

        <Pressable style={styles.backButton} onPress={() => console.log('Edit')}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* BLOCK 1: Main Summary */}
        {(currentLead?.guestName || currentLead?.price || (stage?.label && stage?.label !== 'Unknown')) && (
          <View style={[styles.block, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.border }]}>
            <View style={styles.summaryTop}>
              <View style={{ flex: 1 }}>
                {currentLead?.guestName && (
                  <>
                    <Text style={[styles.blockLabel, { color: theme.textSecondary }]}>Lead Name</Text>
                    <Text style={[styles.name, { color: theme.text }]}>{currentLead.guestName}</Text>
                  </>
                )}
              </View>
              {stage?.label && stage?.label !== 'Unknown' && (
                <View style={[styles.stageTag, { backgroundColor: theme.primary + '20', borderColor: theme.primary + '40', borderWidth: 1 }]}>
                  <Text style={[styles.stageTagText, { color: theme.primary }]}>{stage.label}</Text>
                </View>
              )}
            </View>

            {currentLead?.price ? (
              <View style={styles.priceRow}>
                <View>
                  <Text style={[styles.blockLabel, { color: theme.textSecondary }]}>Potential Value</Text>
                  <Text style={[styles.priceLarge, { color: theme.text }]}>
                    $ {formatPrice(currentLead.price)}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* BLOCK 2: Contact Info */}
        {(currentLead?.guestPhone || currentLead?.guestEmail) && (
          <View style={[styles.block, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.border }]}>
            <Text style={[styles.blockHeader, { color: theme.text }]}>Contact Information</Text>

            {currentLead?.guestPhone && (
              <Pressable style={styles.contactItem} onPress={() => console.log('Call')}>
                <View style={[styles.contactIcon, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                  <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactLabel, { color: theme.textSecondary }]}>Phone Number</Text>
                  <Text style={[styles.contactValue, { color: theme.text }]}>{currentLead.guestPhone}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </Pressable>
            )}

            {currentLead?.guestPhone && currentLead?.guestEmail && (
              <View style={[styles.separator, { backgroundColor: theme.border }]} />
            )}

            {currentLead?.guestEmail && (
              <Pressable style={styles.contactItem} onPress={() => console.log('Email')}>
                <View style={[styles.contactIcon, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                  <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactLabel, { color: theme.textSecondary }]}>Email Address</Text>
                  <Text style={[styles.contactValue, { color: theme.text }]}>{currentLead.guestEmail}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>
        )}

        {/* BLOCK 3: Requirements & Custom Fields */}
        {((currentLead?.customFields && currentLead.customFields.length > 0) || (currentLead?.embedded?.tags && currentLead.embedded.tags.length > 0)) && (
          <View style={[styles.block, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.border }]}>
            <Text style={[styles.blockHeader, { color: theme.text }]}>Requirements & Info</Text>

            {currentLead?.customFields && currentLead.customFields.length > 0 && (
              <View style={styles.gridContainer}>
                {currentLead.customFields.map((field: any, index: number) => {
                  const valStr = field.values?.map((v: any) => v.value).join(', ');
                  if (!valStr || valStr.trim() === '') return null;
                  return (
                    <View key={field.field_id || index} style={styles.gridItem}>
                      <Text style={[styles.contactLabel, { color: theme.textSecondary }]} numberOfLines={1}>{field.field_name}</Text>
                      <Text style={[styles.gridValue, { color: theme.text }]}>
                        {valStr}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {currentLead?.embedded?.tags && currentLead.embedded.tags.length > 0 && (
              <View style={{ marginTop: currentLead.customFields && currentLead.customFields.length > 0 ? 16 : 0 }}>
                <Text style={[styles.contactLabel, { color: theme.textSecondary, marginBottom: 8 }]}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {currentLead.embedded.tags.map((tag: any, idx: number) => (
                    <View key={tag.id || idx} style={[styles.tag, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: theme.border }]}>
                      <Text style={[styles.tagText, { color: theme.text }]}>{tag.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* BLOCK 4: System Details */}
        <View style={[styles.block, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: theme.border }]}>
          <Text style={[styles.blockHeader, { color: theme.text }]}>System Details</Text>

          {currentLead?.responsibleUserId && (
            <View style={styles.systemRow}>
              <Text style={[styles.systemLabel, { color: theme.textSecondary }]}>Responsible User ID</Text>
              <Text style={[styles.systemValue, { color: theme.text }]}>{currentLead.responsibleUserId}</Text>
            </View>
          )}

          {currentLead?.createdAt && (
            <View style={styles.systemRow}>
              <Text style={[styles.systemLabel, { color: theme.textSecondary }]}>Created</Text>
              <Text style={[styles.systemValue, { color: theme.text }]}>
                {new Date(currentLead.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Buttons Island */}
      <View style={styles.islandWrapper}>
        <BlurView intensity={25} tint="dark" style={[styles.blurIsland, { borderColor: 'rgba(255,255,255,0.1)' }]}>
          <Pressable
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={() => console.log('Call', currentLead?.guestPhone)}
          >
            <Ionicons name="call" size={18} color="#FFFFFF" />
            <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Call</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, { backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.1)' }]}
            onPress={openActivity}
          >
            <Ionicons name="time-outline" size={18} color={theme.text} />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Timeline ({timelineData.length})</Text>
          </Pressable>
        </BlurView>
      </View>

      {/* Activity Modal */}
      <Modal
        visible={activityVisible}
        transparent
        animationType="none"
        onRequestClose={closeActivity}
      >
        <Animated.View style={[styles.activityBackdrop, { opacity: activityBackdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeActivity} />
        </Animated.View>
        <Animated.View
          style={[
            styles.activityContent,
            {
              backgroundColor: theme.card,
              transform: [{ translateY: activityScrollAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 600] }) }],
            },
          ]}
        >
          <View style={[styles.activityHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.activityHeaderTitle, { color: theme.text }]}>Timeline</Text>
            <Pressable onPress={closeActivity}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {timelineData.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Ionicons name="calendar-outline" size={48} color={theme.textSecondary} style={{ marginBottom: 16 }} />
                <Text style={{ color: theme.text, fontSize: 16, fontWeight: '600' }}>No Activity Found</Text>
                <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 8 }}>This lead hasn't had any interactions recorded yet.</Text>
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                {timelineData.map((item: any) => (
                  <View key={`${item._type}-${item.id}`} style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: item._type === 'note' ? theme.primary + '20' : theme.text + '20', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={item._type === 'note' ? 'chatbubble-outline' : 'git-commit-outline'} size={16} color={item._type === 'note' ? theme.primary : theme.text} />
                    </View>
                    <View style={{ flex: 1, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text }}>
                          {item._type === 'note' ? (item.note_type === 'common' ? 'Note' : item.note_type) : item.type}
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.textSecondary }}>{formatTimelineDate(item.created_at)}</Text>
                      </View>
                      {item.text && (
                        <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>{item.text}</Text>
                      )}
                      {item.params?.text && (
                        <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 20 }}>{item.params.text}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </Modal>
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
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  block: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  blockLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  blockHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
  },
  stageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  priceRow: {
    marginTop: 10,
  },
  priceLarge: {
    fontSize: 32,
    fontWeight: '800',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginVertical: 16,
    marginLeft: 60,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '47%',
  },
  gridValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  systemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  systemLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  systemValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  islandWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  blurIsland: {
    padding: 12,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activityBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  activityContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
  },
  activityHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
});
