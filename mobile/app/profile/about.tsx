import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

export default function AboutScreen() {
  const router = useRouter();
  const { theme } = useTheme();

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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>About</Text>
        
        <View style={styles.backButton} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('@/assets/images/new logo blue.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>For You Real Estate</Text>
          <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</Text>
        </View>
        
        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            For You Real Estate is your complete solution for managing real estate operations in Dubai and the UAE. Built for brokers, agents, and investors.
          </Text>
        </View>
        
        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>
          <View style={styles.featuresList}>
            <FeatureItem 
              icon="search-outline"
              title="Property Search"
              description="Advanced search and filtering capabilities"
              theme={theme}
            />
            <FeatureItem 
              icon="people-outline"
              title="Lead Management"
              description="Powerful CRM for managing clients and leads"
              theme={theme}
            />
            <FeatureItem 
              icon="folder-outline"
              title="Collections"
              description="Organize properties into custom collections"
              theme={theme}
            />
            <FeatureItem 
              icon="analytics-outline"
              title="Analytics"
              description="Track performance and market insights"
              theme={theme}
            />
            <FeatureItem 
              icon="notifications-outline"
              title="Notifications"
              description="Real-time updates on leads and properties"
              theme={theme}
            />
            <FeatureItem 
              icon="sync-outline"
              title="Cloud Sync"
              description="Access your data across all devices"
              theme={theme}
            />
          </View>
        </View>
        
        {/* Company Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Company</Text>
          <View style={[styles.infoBox, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.companyName, { color: theme.text }]}>For You Real Estate LLC</Text>
            <Text style={[styles.companyAddress, { color: theme.textSecondary }]}>Dubai, United Arab Emirates</Text>
          </View>
        </View>
        
        {/* Contact */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Us</Text>
          <View style={styles.contactList}>
            <ContactItem 
              icon="mail-outline"
              label="Email"
              value="info@foryourealestate.com"
              theme={theme}
            />
            <ContactItem 
              icon="call-outline"
              label="Phone"
              value="+971 50 123 4567"
              theme={theme}
            />
            <ContactItem 
              icon="globe-outline"
              label="Website"
              value="www.foryourealestate.com"
              theme={theme}
            />
          </View>
        </View>
        
        {/* Social Media */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Follow Us</Text>
          <View style={styles.socialButtons}>
            <Pressable 
              style={({ pressed }) => [
                styles.socialButton,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="logo-instagram" size={24} color="#E4405F" />
            </Pressable>
            <Pressable 
              style={({ pressed }) => [
                styles.socialButton,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
            </Pressable>
            <Pressable 
              style={({ pressed }) => [
                styles.socialButton,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            </Pressable>
            <Pressable 
              style={({ pressed }) => [
                styles.socialButton,
                { backgroundColor: theme.primaryLight, borderColor: theme.border },
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
            </Pressable>
          </View>
        </View>
        
        {/* Legal */}
        <View style={styles.section}>
          <Text style={[styles.legalText, { color: theme.textSecondary }]}>
            © 2025 For You Real Estate. All rights reserved.
          </Text>
        </View>
        
        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={[styles.creditsText, { color: theme.textTertiary }]}>Made with ❤️ in Dubai</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  theme: any;
}

function FeatureItem({ icon, title, description, theme }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: theme.primaryLight }]}>
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>{description}</Text>
      </View>
    </View>
  );
}

interface ContactItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  theme: any;
}

function ContactItem({ icon, label, value, theme }: ContactItemProps) {
  return (
    <View style={styles.contactItem}>
      <View style={[styles.contactIcon, { backgroundColor: theme.primaryLight }]}>
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.contactContent}>
        <Text style={[styles.contactLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.contactValue, { color: theme.primary }]}>{value}</Text>
      </View>
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
    paddingBottom: 32,
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    paddingTop: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  companyAddress: {
    fontSize: 14,
  },
  contactList: {
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  legalText: {
    fontSize: 13,
    textAlign: 'center',
  },
  creditsSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  creditsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

