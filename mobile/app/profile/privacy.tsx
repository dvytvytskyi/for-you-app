import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

export default function PrivacyPolicyScreen() {
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
        
        <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
        
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Introduction</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            For You Real Estate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
          </Text>
        </View>
        
        {/* Information We Collect */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Information We Collect</Text>
          
          <Text style={[styles.subsectionTitle, { color: theme.text }]}>Personal Information</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We may collect personal information that you provide directly to us, including:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Name and contact information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Email address and phone number</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Professional credentials and license numbers</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Profile picture and avatar</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Property preferences and search history</Text>
          </View>
          
          <Text style={[styles.subsectionTitle, { color: theme.text }]}>Usage Information</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We automatically collect certain information about your device and how you interact with our application:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Device information and identifiers</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Log data and analytics</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Location data (with your permission)</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• App usage patterns and preferences</Text>
          </View>
        </View>
        
        {/* How We Use Your Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We use the information we collect to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Provide and maintain our services</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Process your transactions and manage your account</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Send you notifications about leads and properties</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Improve and personalize your experience</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Analyze usage patterns and trends</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Communicate with you about updates and offers</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Ensure security and prevent fraud</Text>
          </View>
        </View>
        
        {/* Information Sharing */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Information Sharing</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We may share your information in the following circumstances:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• With your consent or at your direction</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• With service providers who assist our operations</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• To comply with legal obligations</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• To protect our rights and prevent fraud</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• In connection with a business transaction</Text>
          </View>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We do not sell your personal information to third parties.
          </Text>
        </View>
        
        {/* Data Security */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Security</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </Text>
        </View>
        
        {/* Your Rights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Rights</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            Depending on your location, you may have certain rights regarding your personal information:
          </Text>
          <View style={styles.bulletList}>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Access your personal information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Correct inaccurate information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Request deletion of your information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Object to processing of your information</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Data portability</Text>
            <Text style={[styles.bulletItem, { color: theme.textSecondary }]}>• Withdraw consent</Text>
          </View>
        </View>
        
        {/* Contact Us */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Us</Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </Text>
          <View style={[styles.contactBox, { backgroundColor: theme.primaryLight }]}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={16} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.primary }]}>privacy@foryourealestate.com</Text>
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
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

