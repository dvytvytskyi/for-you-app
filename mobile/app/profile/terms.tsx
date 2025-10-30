import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

export default function TermsOfServiceScreen() {
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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Terms of Service</Text>
        
        <View style={styles.backButton} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Last Updated */}
        <View style={[styles.updateSection, { backgroundColor: theme.primaryLight, borderBottomColor: theme.border }]}>
          <Text style={[styles.updateText, { color: theme.textSecondary }]}>Last Updated: January 15, 2025</Text>
        </View>
        
        {/* Introduction */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Agreement to Terms</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            These Terms of Service constitute a legally binding agreement between you and For You Real Estate ("Company," "we," "us," or "our") concerning your access to and use of the For You Real Estate mobile application.
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            By accessing or using the application, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the application.
          </Text>
        </View>
        
        {/* User Accounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>User Accounts</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            To use certain features of the application, you must register for an account. When you register:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You must provide accurate and complete information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You are responsible for maintaining account security</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You must be at least 18 years old</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You may not share your account with others</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You must notify us of any unauthorized access</Text>
          </View>
        </View>
        
        {/* Acceptable Use */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Acceptable Use</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            You agree not to use the application to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Violate any applicable laws or regulations</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Infringe on intellectual property rights</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Transmit harmful or malicious code</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Harass, abuse, or harm other users</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Engage in fraudulent activities</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Interfere with application functionality</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Scrape or collect data without permission</Text>
          </View>
        </View>
        
        {/* Broker Services */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Broker Services</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            If you use the application as a real estate broker or agent:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You must maintain valid professional licenses</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You are responsible for your interactions with clients</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You must comply with real estate regulations</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You agree to represent properties accurately</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• You are liable for your professional conduct</Text>
          </View>
        </View>
        
        {/* Property Listings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Property Listings</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            All property information provided through the application is for informational purposes only. We do not guarantee:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Accuracy of property descriptions or prices</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Availability of listed properties</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Completeness of property information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Suitability of properties for your needs</Text>
          </View>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            You should conduct your own due diligence before making any real estate decisions.
          </Text>
        </View>
        
        {/* Intellectual Property */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Intellectual Property</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            The application and its content, features, and functionality are owned by For You Real Estate and are protected by international copyright, trademark, and other intellectual property laws.
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </Text>
        </View>
        
        {/* Limitation of Liability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Limitation of Liability</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            To the maximum extent permitted by law, For You Real Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Our total liability shall not exceed the amount paid by you, if any, for accessing the application during the twelve months preceding the claim.
          </Text>
        </View>
        
        {/* Termination */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Termination</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We may terminate or suspend your account and access to the application immediately, without prior notice, for any reason, including if you breach these Terms.
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Upon termination, your right to use the application will cease immediately.
          </Text>
        </View>
        
        {/* Changes to Terms */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Changes to Terms</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on the application and updating the "Last Updated" date.
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Your continued use of the application after changes become effective constitutes acceptance of the revised Terms.
          </Text>
        </View>
        
        {/* Governing Law */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Governing Law</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.
          </Text>
        </View>
        
        {/* Contact Us */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Us</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            If you have questions about these Terms of Service, please contact us at:
          </Text>
          <View style={[styles.contactBox, { backgroundColor: theme.primaryLight }]}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.primary }]}>legal@foryourealestate.com</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={16} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.primary }]}>+971 50 123 4567</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 32,
  },
  updateSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  updateText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginTop: 8,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 15,
    lineHeight: 24,
    paddingLeft: 8,
    marginBottom: 4,
  },
  contactBox: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

