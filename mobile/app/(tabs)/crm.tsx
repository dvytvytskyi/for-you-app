import { View, Text, StyleSheet, Pressable, ScrollView, Modal, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, SearchBar, Dropdown } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';

const LEAD_STAGES = [
  { label: 'New', value: 'new', color: '#4CAF50' },
  { label: 'Qualified', value: 'qualified', color: '#2196F3' },
  { label: 'Contacted', value: 'contacted', color: '#00BCD4' },
  { label: 'Proposal', value: 'proposal', color: '#FF9800' },
  { label: 'Negotiation', value: 'negotiation', color: '#9C27B0' },
  { label: 'Closed', value: 'closed', color: '#607D8B' },
];

interface Lead {
  id: string;
  name: string;
  price: number;
  stage: string;
}

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'John Smith', price: 1500000, stage: 'new' },
  { id: '2', name: 'Sarah Johnson', price: 850000, stage: 'qualified' },
  { id: '3', name: 'Mike Davis', price: 2200000, stage: 'contacted' },
  { id: '4', name: 'Emma Wilson', price: 1200000, stage: 'proposal' },
  { id: '5', name: 'David Brown', price: 950000, stage: 'negotiation' },
  { id: '6', name: 'Lisa Anderson', price: 1800000, stage: 'closed' },
];

export default function CRMScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const mockLeadCount = leads.length;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 120,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const handleSelectStage = (value: string) => {
    setSelectedStage(value);
    setFilterActive(value !== '');
    closeModal();
  };

  const handleToggleFilter = () => {
    if (filterActive && selectedStage) {
      setSelectedStage('');
      setFilterActive(false);
    } else {
      setModalVisible(true);
    }
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const LeadCard = ({ item }: { item: Lead }) => {
    const stage = LEAD_STAGES.find(s => s.value === item.stage);
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('en-US').format(price);
    };

    return (
      <Pressable
        onPress={() => router.push(`/lead/${item.id}`)}
        style={[styles.leadCard, { borderColor: theme.border, backgroundColor: theme.card }]}
      >
        <View style={styles.leadTopRow}>
          <Text style={[styles.leadName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.leadPrice, { color: theme.textSecondary }]}>
            {formatPrice(item.price)} $
          </Text>
        </View>
        <View style={styles.leadBottomRow}>
          <View style={[styles.stageTag, { backgroundColor: stage?.color || '#999' }]}>
            <Text style={styles.stageTagText}>{stage?.label || 'Unknown'}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={theme.textSecondary} />
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <Header 
        title={t('tabs.crm.title')}
        avatar="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
      />
      
      {/* Fixed Header Section */}
      <View style={styles.fixedSection}>
        {/* Search, Stage Filter, and Add Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('tabs.crm.findByName')}
            />
          </View>
          <Pressable
            style={[
              styles.filterButton, 
              { 
                borderColor: filterActive ? theme.primary : theme.border, 
                backgroundColor: filterActive ? theme.primary : theme.card 
              }
            ]}
            onPress={handleToggleFilter}
          >
            <Ionicons 
              name="filter" 
              size={20} 
              color={filterActive ? '#FFFFFF' : theme.text} 
            />
          </Pressable>
          <Pressable
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => console.log('Add lead')}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Lead Count */}
        <View style={styles.countContainer}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.countText, { color: theme.textSecondary }]}>
            {t('tabs.crm.leadsFound', { count: mockLeadCount })}
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
        </View>
      </View>

      {/* Scrollable Leads List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {leads.map((lead) => (
          <LeadCard key={lead.id} item={lead} />
        ))}
      </ScrollView>

      {/* Stage Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideUp }],
                backgroundColor: theme.background,
              },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.primary }]}>Select Stage</Text>
              <Pressable onPress={closeModal}>
                <Ionicons name="chevron-down" size={24} color={theme.text} />
              </Pressable>
            </View>
            <FlatList
              data={LEAD_STAGES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.modalItem,
                    { borderBottomColor: theme.border },
                    item.value === LEAD_STAGES[LEAD_STAGES.length - 1].value && styles.lastModalItem,
                  ]}
                  onPress={() => handleSelectStage(item.value)}
                >
                  <Text style={[styles.modalItemText, { color: theme.text }]}>
                    {item.label}
                  </Text>
                  {selectedStage === item.value && (
                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                  )}
                </Pressable>
              )}
            />
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedSection: {
    padding: 16,
    paddingBottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchBarContainer: {
    flex: 1,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  countText: {
    fontSize: 14,
    paddingHorizontal: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '400',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  lastModalItem: {
    paddingBottom: 32,
  },
  modalItemText: {
    fontSize: 16,
  },
  leadCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  leadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  leadBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  leadPrice: {
    fontSize: 14,
  },
  stageTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

