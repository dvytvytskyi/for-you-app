import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Initial notification settings (would come from API/Store)
  const initialSettings = {
    // Push Notifications
    pushEnabled: true,
    newLeads: true,
    leadUpdates: true,
    propertyMatches: true,
    priceChanges: false,
    
    // Email Notifications
    emailEnabled: true,
    weeklyDigest: true,
    monthlyReport: false,
    marketInsights: true,
    
    // Marketing
    marketingEnabled: false,
    promotions: false,
    newsUpdates: false,
    events: false,
  };
  
  const [settings, setSettings] = useState(initialSettings);
  
  // Check if settings changed
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleBack = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };
  
  const handleSave = () => {
    if (!hasChanges) return;
    
    // Save logic here (API call)
    Alert.alert('Success', 'Notification preferences updated successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
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
          onPress={handleBack}
        >
          <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        
        <View style={styles.backButton} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: theme.backgroundSecondary }]}>
          <Ionicons name="notifications-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Manage how you receive notifications about leads, properties, and updates.
          </Text>
        </View>
        
        {/* Push Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Push Notifications</Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Receive instant updates on your mobile device
          </Text>
          
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="notifications"
              label="Enable Push Notifications"
              description="Master switch for all push notifications"
              value={settings.pushEnabled}
              onToggle={() => handleToggle('pushEnabled')}
              isFirst
            />
            
            <View style={styles.subGroup}>
              <SettingItem
                icon="people"
                label="New Leads"
                description="When you receive a new lead"
                value={settings.newLeads}
                onToggle={() => handleToggle('newLeads')}
                disabled={!settings.pushEnabled}
              />
              <SettingItem
                icon="refresh"
                label="Lead Updates"
                description="When lead status changes"
                value={settings.leadUpdates}
                onToggle={() => handleToggle('leadUpdates')}
                disabled={!settings.pushEnabled}
              />
              <SettingItem
                icon="home"
                label="Property Matches"
                description="When properties match lead preferences"
                value={settings.propertyMatches}
                onToggle={() => handleToggle('propertyMatches')}
                disabled={!settings.pushEnabled}
              />
              <SettingItem
                icon="pricetag"
                label="Price Changes"
                description="When property prices change"
                value={settings.priceChanges}
                onToggle={() => handleToggle('priceChanges')}
                disabled={!settings.pushEnabled}
              />
            </View>
          </View>
        </View>
        
        {/* Email Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Email Notifications</Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Get updates and reports via email
          </Text>
          
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="mail"
              label="Enable Email Notifications"
              description="Master switch for all email notifications"
              value={settings.emailEnabled}
              onToggle={() => handleToggle('emailEnabled')}
              isFirst
            />
            
            <View style={styles.subGroup}>
              <SettingItem
                icon="calendar"
                label="Weekly Digest"
                description="Summary of weekly activity"
                value={settings.weeklyDigest}
                onToggle={() => handleToggle('weeklyDigest')}
                disabled={!settings.emailEnabled}
              />
              <SettingItem
                icon="stats-chart"
                label="Monthly Report"
                description="Detailed monthly performance report"
                value={settings.monthlyReport}
                onToggle={() => handleToggle('monthlyReport')}
                disabled={!settings.emailEnabled}
              />
              <SettingItem
                icon="trending-up"
                label="Market Insights"
                description="Market trends and analysis"
                value={settings.marketInsights}
                onToggle={() => handleToggle('marketInsights')}
                disabled={!settings.emailEnabled}
              />
            </View>
          </View>
        </View>
        
        {/* Marketing Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Marketing & Updates</Text>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Promotional content and news
          </Text>
          
          <View style={styles.settingsGroup}>
            <SettingItem
              icon="megaphone"
              label="Enable Marketing"
              description="Receive promotional content"
              value={settings.marketingEnabled}
              onToggle={() => handleToggle('marketingEnabled')}
              isFirst
            />
            
            <View style={styles.subGroup}>
              <SettingItem
                icon="gift"
                label="Promotions"
                description="Special offers and deals"
                value={settings.promotions}
                onToggle={() => handleToggle('promotions')}
                disabled={!settings.marketingEnabled}
              />
              <SettingItem
                icon="newspaper"
                label="News Updates"
                description="Industry news and updates"
                value={settings.newsUpdates}
                onToggle={() => handleToggle('newsUpdates')}
                disabled={!settings.marketingEnabled}
              />
              <SettingItem
                icon="calendar-outline"
                label="Events"
                description="Upcoming events and webinars"
                value={settings.events}
                onToggle={() => handleToggle('events')}
                disabled={!settings.marketingEnabled}
                isLast
              />
            </View>
          </View>
        </View>
        
        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: hasChanges ? theme.primary : theme.border },
              { opacity: pressed && hasChanges ? 0.9 : 1, transform: [{ scale: pressed && hasChanges ? 0.98 : 1 }] }
            ]}
            onPress={handleSave}
            disabled={!hasChanges}
          >
            <Text style={[styles.saveButtonText, { color: hasChanges ? '#FFFFFF' : theme.textTertiary }]}>Save Preferences</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
  disabled?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

function SettingItem({ icon, label, description, value, onToggle, disabled = false, isFirst = false, isLast = false }: SettingItemProps) {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.settingItem,
      { 
        backgroundColor: theme.card, 
        borderBottomColor: theme.border 
      },
      isFirst && styles.settingItemFirst,
      isLast && styles.settingItemLast,
      disabled && styles.settingItemDisabled
    ]}>
      <View style={[styles.settingIcon, { backgroundColor: theme.backgroundSecondary }]}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={disabled ? theme.textTertiary : theme.primary} 
        />
      </View>
      
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: disabled ? theme.textTertiary : theme.text }]}>
          {label}
        </Text>
        <Text style={[styles.settingDescription, { color: disabled ? theme.textTertiary : theme.textSecondary }]}>
          {description}
        </Text>
      </View>
      
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={theme.border}
      />
    </View>
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
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  settingsGroup: {
    // Dynamic background via theme
  },
  subGroup: {
    paddingLeft: 16,
    // Dynamic background via theme
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 0.5,
  },
  settingItemFirst: {
    borderTopWidth: 0.5,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

