import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';

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
  email: string;
  phone: string;
  price: number;
  stage: string;
  responsible?: string;
  planDate?: string;
  budgetRange?: string;
  commissionAED?: number;
  commissionUSD?: number;
  purchasePurpose?: string;
  source: string;
  purchaseDate?: string;
  propertyCost?: number;
  dealType?: string;
  temperature?: string;
  commissionPercent?: number;
  document1?: string;
  document2?: string;
  passport?: string;
  clientType?: string;
  refusalReason?: string;
  other?: string;
  lastTouchDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_LEADS: Lead[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john.smith@email.com',
    phone: '+971 50 123 4567',
    price: 1500000, 
    stage: 'new',
    responsible: 'Maria Ivanova',
    planDate: 'Q2 2024',
    budgetRange: '$1M - $2M',
    commissionAED: 45000,
    commissionUSD: 12272,
    purchasePurpose: 'Investment',
    source: 'Website Contact Form',
    purchaseDate: 'Mar 2024',
    propertyCost: 1500000,
    dealType: 'New Development',
    temperature: 'Hot',
    commissionPercent: 2,
    document1: 'Passport',
    document2: 'Proof of Income',
    passport: 'A12345678',
    clientType: 'Investor',
    lastTouchDate: '2024-01-15',
    notes: 'Interested in 2-bedroom apartments in Downtown Dubai. Prefers waterfront properties.',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    email: 'sarah.j@email.com',
    phone: '+971 55 234 5678',
    price: 850000, 
    stage: 'qualified',
    responsible: 'Alex Petrov',
    planDate: 'Q3 2024',
    budgetRange: '$500K - $1M',
    commissionAED: 25500,
    commissionUSD: 6944,
    purchasePurpose: 'First Home',
    source: 'Facebook Ads',
    purchaseDate: 'Apr 2024',
    propertyCost: 850000,
    dealType: 'Resale',
    temperature: 'Warm',
    commissionPercent: 2,
    document1: 'Passport',
    passport: 'B87654321',
    clientType: 'End User',
    lastTouchDate: '2024-01-18',
    notes: 'Looking for investment properties. Budget flexible for good opportunities.',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-18',
  },
  { 
    id: '3', 
    name: 'Mike Davis', 
    email: 'm.davis@email.com',
    phone: '+971 52 345 6789',
    price: 2200000, 
    stage: 'contacted',
    responsible: 'Anna Petrova',
    planDate: 'Q1 2024',
    budgetRange: '$2M - $3M',
    commissionAED: 66000,
    commissionUSD: 17973,
    purchasePurpose: 'Investment',
    source: 'Referral',
    purchaseDate: 'Feb 2024',
    propertyCost: 2200000,
    dealType: 'New Development',
    temperature: 'Hot',
    commissionPercent: 2,
    document1: 'Passport',
    document2: 'Bank Statement',
    passport: 'C11223344',
    clientType: 'Investor',
    lastTouchDate: '2024-01-20',
    notes: 'VIP client referred by agent. High priority.',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20',
  },
  { 
    id: '4', 
    name: 'Emma Wilson', 
    email: 'ewilson@email.com',
    phone: '+971 54 456 7890',
    price: 1200000, 
    stage: 'proposal',
    responsible: 'Dmitry Sokolov',
    planDate: 'Q2 2024',
    budgetRange: '$1M - $1.5M',
    commissionAED: 36000,
    commissionUSD: 9811,
    purchasePurpose: 'Residence',
    source: 'Instagram',
    purchaseDate: 'May 2024',
    propertyCost: 1200000,
    dealType: 'Resale',
    temperature: 'Warm',
    commissionPercent: 2,
    document1: 'Passport',
    document2: 'Employment Certificate',
    passport: 'D55667788',
    clientType: 'End User',
    lastTouchDate: '2024-01-19',
    notes: 'Has seen 3 properties. Liked the Marina apartment the most.',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-19',
  },
  { 
    id: '5', 
    name: 'David Brown', 
    email: 'davidb@email.com',
    phone: '+971 56 567 8901',
    price: 950000, 
    stage: 'negotiation',
    responsible: 'Elena Volkova',
    planDate: 'Q2 2024',
    budgetRange: '$500K - $1M',
    commissionAED: 28500,
    commissionUSD: 7768,
    purchasePurpose: 'Investment',
    source: 'Website',
    purchaseDate: 'Jun 2024',
    propertyCost: 950000,
    dealType: 'New Development',
    temperature: 'Hot',
    commissionPercent: 2,
    document1: 'Passport',
    passport: 'E99887766',
    clientType: 'Investor',
    lastTouchDate: '2024-01-22',
    notes: 'Negotiating payment terms. Wants to finalize by end of month.',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-22',
  },
  { 
    id: '6', 
    name: 'Lisa Anderson', 
    email: 'l.anderson@email.com',
    phone: '+971 50 678 9012',
    price: 1800000, 
    stage: 'closed',
    responsible: 'Sergey Morozov',
    planDate: 'Q1 2024',
    budgetRange: '$1.5M - $2M',
    commissionAED: 54000,
    commissionUSD: 14714,
    purchasePurpose: 'Residence',
    source: 'Direct Call',
    purchaseDate: 'Jan 2024',
    propertyCost: 1800000,
    dealType: 'Resale',
    temperature: 'Cold',
    commissionPercent: 2,
    document1: 'Passport',
    passport: 'F33445566',
    clientType: 'End User',
    lastTouchDate: '2024-01-10',
    notes: 'Deal completed. Property transferred. Awaiting handover.',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-10',
  },
];

interface Activity {
  id: string;
  type: 'message' | 'system' | 'note';
  timestamp: string;
  author?: string;
  content: string;
  channel?: string;
  status?: string;
  direction?: 'sent' | 'received';
}

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'message',
    timestamp: 'Today 13:08',
    author: 'Agent',
    content: 'Good afternoon, Lurdes Brogueira! We\'ve received your request for assistance in finding a property in the UAE. Thank you for your enquiry! Our agent will contact you shortly.',
    channel: 'WhatsApp',
    status: 'Read',
    direction: 'sent',
  },
  {
    id: '2',
    type: 'system',
    timestamp: 'Today 13:11',
    content: 'Responsible change: 2 events',
  },
  {
    id: '3',
    type: 'message',
    timestamp: 'Today 13:11',
    author: 'Lurdes Brogueira',
    content: 'Contacte me just right on wattsapp...because I do not speak english',
    direction: 'received',
  },
  {
    id: '4',
    type: 'system',
    timestamp: 'Today 16:09',
    author: 'Abdullaev Ruslan',
    content: 'New stage: APPLICATION TAKEN from APPLICATION RECEIVED',
  },
  {
    id: '5',
    type: 'system',
    timestamp: 'Today 16:09',
    author: 'Robot',
    content: 'NEW LEAD: New lead. Take into work Robot',
  },
  {
    id: '6',
    type: 'note',
    timestamp: 'Today 16:11',
    author: 'Abdullaev Ruslan',
    content: 'Written that doesn\'t speak English, writing directly to WhatsApp',
  },
];

export default function LeadDetailScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const router = useRouter();

  const [activityVisible, setActivityVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedLead, setEditedLead] = useState<any>(null);
  const [activityScrollAnim] = useState(new Animated.Value(1));
  const [activityBackdropOpacity] = useState(new Animated.Value(0));

  const lead = useMemo(() => {
    return MOCK_LEADS.find(l => l.id === id);
  }, [id]);

  const stage = useMemo(() => {
    return LEAD_STAGES.find(s => s.value === lead?.stage);
  }, [lead?.stage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
    }
  }, [lead]);

  useEffect(() => {
    if (activityVisible) {
      Animated.parallel([
        Animated.timing(activityScrollAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(activityBackdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      activityScrollAnim.setValue(1);
      activityBackdropOpacity.setValue(0);
    }
  }, [activityVisible]);

  const openActivity = useCallback(() => {
    setActivityVisible(true);
  }, []);

  const closeActivity = useCallback(() => {
    Animated.parallel([
      Animated.timing(activityScrollAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(activityBackdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActivityVisible(false);
    });
  }, []);

  const saveChanges = () => {
    setEditMode(false);
    console.log('Saving changes:', editedLead);
  };

  const cancelEdit = () => {
    setEditedLead(lead);
    setEditMode(false);
  };

  const currentLead = editMode ? editedLead : lead;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Leads</Text>
        
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Name and Price */}
        <View style={styles.namePriceRow}>
          {editMode ? (
            <TextInput
              style={[styles.editInput, { color: theme.text, borderColor: theme.border }]}
              value={editedLead?.name}
              onChangeText={(text) => setEditedLead({ ...editedLead, name: text })}
            />
          ) : (
            <Text style={[styles.name, { color: theme.text }]}>{currentLead?.name}</Text>
          )}
          <Text style={[styles.price, { color: '#FF9500' }]}>
            {currentLead && formatPrice(currentLead.price)} $
          </Text>
        </View>

        {/* Stage */}
        <View style={styles.stageContainer}>
          <View style={[styles.stageTag, { backgroundColor: stage?.color || '#999' }]}>
            <Text style={styles.stageTagText}>{stage?.label || 'Unknown'}</Text>
          </View>
        </View>

        {/* Details Table */}
        <View style={styles.detailsTable}>
          {currentLead?.responsible && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Responsible</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.responsible}
                  onChangeText={(text) => setEditedLead({ ...editedLead, responsible: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.responsible}</Text>
              )}
            </View>
          )}
          {currentLead?.budgetRange && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Budget</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.budgetRange}
                  onChangeText={(text) => setEditedLead({ ...editedLead, budgetRange: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.budgetRange}</Text>
              )}
            </View>
          )}
          {currentLead?.planDate && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Plan Date</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.planDate}
                  onChangeText={(text) => setEditedLead({ ...editedLead, planDate: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.planDate}</Text>
              )}
            </View>
          )}
          {currentLead?.commissionAED && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Commission (AED)</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {currentLead && formatPrice(currentLead.commissionAED)} AED
              </Text>
            </View>
          )}
          {currentLead?.commissionUSD && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Commission (USD)</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {currentLead && formatPrice(currentLead.commissionUSD)} $
              </Text>
            </View>
          )}
          {currentLead?.purchasePurpose && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Purchase Purpose</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.purchasePurpose}
                  onChangeText={(text) => setEditedLead({ ...editedLead, purchasePurpose: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.purchasePurpose}</Text>
              )}
            </View>
          )}
          {currentLead?.source && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Source</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.source}
                  onChangeText={(text) => setEditedLead({ ...editedLead, source: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.source}</Text>
              )}
            </View>
          )}
          {currentLead?.purchaseDate && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Purchase Date</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.purchaseDate}
                  onChangeText={(text) => setEditedLead({ ...editedLead, purchaseDate: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.purchaseDate}</Text>
              )}
            </View>
          )}
          {currentLead?.propertyCost && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Property Cost</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {currentLead && formatPrice(currentLead.propertyCost)} $
              </Text>
            </View>
          )}
          {currentLead?.dealType && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Deal Type</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.dealType}
                  onChangeText={(text) => setEditedLead({ ...editedLead, dealType: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.dealType}</Text>
              )}
            </View>
          )}
          {currentLead?.temperature && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Temperature</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.temperature}
                  onChangeText={(text) => setEditedLead({ ...editedLead, temperature: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.temperature}</Text>
              )}
            </View>
          )}
          {currentLead?.commissionPercent !== undefined && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Commission %</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.commissionPercent}%</Text>
            </View>
          )}
          {currentLead?.document1 && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Document 1</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.document1}
                  onChangeText={(text) => setEditedLead({ ...editedLead, document1: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.document1}</Text>
              )}
            </View>
          )}
          {currentLead?.document2 && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Document 2</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.document2}
                  onChangeText={(text) => setEditedLead({ ...editedLead, document2: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.document2}</Text>
              )}
            </View>
          )}
          {currentLead?.passport && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Passport</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.passport}
                  onChangeText={(text) => setEditedLead({ ...editedLead, passport: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.passport}</Text>
              )}
            </View>
          )}
          {currentLead?.clientType && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Client Type</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.clientType}
                  onChangeText={(text) => setEditedLead({ ...editedLead, clientType: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.clientType}</Text>
              )}
            </View>
          )}
          {currentLead?.refusalReason && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Refusal Reason</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.refusalReason}
                  onChangeText={(text) => setEditedLead({ ...editedLead, refusalReason: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.refusalReason}</Text>
              )}
            </View>
          )}
          {currentLead?.other && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Other</Text>
              {editMode ? (
                <TextInput
                  style={[styles.editInputSmall, { color: theme.text, borderColor: theme.border }]}
                  value={editedLead?.other}
                  onChangeText={(text) => setEditedLead({ ...editedLead, other: text })}
                />
              ) : (
                <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.other}</Text>
              )}
            </View>
          )}
          {currentLead?.lastTouchDate && (
            <View style={[styles.detailRow, { borderBottomColor: theme.border }]}>
              <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Last Touch</Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>{currentLead.lastTouchDate}</Text>
            </View>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
          <View style={[styles.infoRow, { borderBottomColor: theme.border, borderBottomWidth: 0.5 }]}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            {editMode ? (
              <TextInput
                style={[styles.editInputSmallInline, { borderColor: theme.border }]}
                value={editedLead?.email}
                onChangeText={(text) => setEditedLead({ ...editedLead, email: text })}
              />
            ) : (
              <Text style={[styles.infoText, { color: theme.text }]}>{currentLead?.email}</Text>
            )}
          </View>
          <View style={[styles.infoRow, { borderBottomColor: theme.border, borderBottomWidth: 0.5 }]}>
            <Ionicons name="call-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            {editMode ? (
              <TextInput
                style={[styles.editInputSmallInline, { borderColor: theme.border }]}
                value={editedLead?.phone}
                onChangeText={(text) => setEditedLead({ ...editedLead, phone: text })}
              />
            ) : (
              <Text style={[styles.infoText, { color: theme.text }]}>{currentLead?.phone}</Text>
            )}
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            <Text style={[styles.infoText, { color: theme.text }]}>Dubai, UAE</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={[styles.bottomButtonContainer, { borderTopColor: theme.border, backgroundColor: theme.background }]}>
        {editMode ? (
          <>
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={saveChanges}
            >
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={cancelEdit}
            >
              <Ionicons name="close" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Cancel</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => console.log('Call')}
            >
              <Ionicons name="call" size={20} color="#FFFFFF" />
              <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>Call</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={openActivity}
            >
              <Ionicons name="document-text-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Activity</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => setEditMode(true)}
            >
              <Ionicons name="create-outline" size={20} color={theme.text} />
              <Text style={[styles.actionButtonText, { color: theme.text }]}>Edit</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* Activity Modal */}
      <Modal
        visible={activityVisible}
        transparent
        animationType="none"
        onRequestClose={closeActivity}
      >
        <Animated.View
          style={[
            styles.activityBackdrop,
            {
              opacity: activityBackdropOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeActivity}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.activityContent,
            {
              transform: [
                {
                  translateY: activityScrollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 400],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.activityHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.activityHeaderTitle, { color: theme.text }]}>Conversation #A1264</Text>
            <Pressable onPress={closeActivity}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView style={styles.activityScroll} contentContainerStyle={styles.activityScrollContent}>
            {MOCK_ACTIVITIES.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                {activity.type === 'system' && (
                  <View style={styles.systemMessage}>
                    <Text style={[styles.systemMessageText, { color: theme.textSecondary }]}>
                      {activity.timestamp} {activity.author && `• ${activity.author}`}
                    </Text>
                    <Text style={[styles.activityContentText, { color: theme.text }]}>{activity.content}</Text>
                  </View>
                )}
                {activity.type === 'message' && (
                  <View
                    style={[
                      styles.messageBubble,
                      activity.direction === 'sent' ? styles.messageBubbleSent : styles.messageBubbleReceived,
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <Text style={[styles.messageTimestamp, { color: theme.textSecondary }]}>
                        {activity.timestamp}
                      </Text>
                      {activity.channel && activity.status && (
                        <Text style={[styles.messageStatus, { color: theme.textSecondary }]}>
                          {activity.channel} ✓ {activity.status}
                        </Text>
                      )}
                      {activity.author && (
                        <Text style={[styles.messageAuthor, { color: theme.textSecondary }]}>
                          {activity.author}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.messageText, { color: theme.text }]}>{activity.content}</Text>
                  </View>
                )}
                {activity.type === 'note' && (
                  <View style={styles.noteMessage}>
                    <Text style={[styles.noteTimestamp, { color: theme.textSecondary }]}>
                      {activity.timestamp} {activity.author}
                    </Text>
                    <Text style={[styles.noteText, { color: theme.text }]}>{activity.content}</Text>
                  </View>
                )}
              </View>
            ))}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
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
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
  },
  editInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
  },
  stageContainer: {
    marginBottom: 24,
  },
  stageTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  stageTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 30,
  },
  detailsTable: {
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  editInputSmall: {
    width: 150,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  editInputSmallInline: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
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
    borderTopWidth: 0.5,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  activityContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  activityHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityScroll: {
    flex: 1,
  },
  activityScrollContent: {
    padding: 16,
  },
  activityItem: {
    marginBottom: 16,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    marginBottom: 4,
  },
  activityContentText: {
    fontSize: 14,
    textAlign: 'center',
  },
  messageBubble: {
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
  },
  messageBubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3F2FD',
  },
  messageBubbleReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
  },
  messageHeader: {
    marginBottom: 8,
  },
  messageTimestamp: {
    fontSize: 12,
  },
  messageStatus: {
    fontSize: 12,
  },
  messageAuthor: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
  },
  noteMessage: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
  },
  noteTimestamp: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 14,
  },
});
