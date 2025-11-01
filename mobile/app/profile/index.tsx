import { View, StyleSheet, ScrollView, Alert, Modal, Image, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHeader, SettingsSection, SettingsItem } from '@/components/ui';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';
import { useLanguageStore } from '@/store/languageStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { language } = useLanguageStore();
  
  // Get current language display name
  const getLanguageDisplayName = () => {
    switch (language) {
      case 'en':
        return t('profile.english');
      case 'ua':
        return t('profile.ukrainian');
      case 'ru':
        return t('profile.russian');
      default:
        return t('profile.english');
    }
  };
  
  // Mock user data - буде з API/Store
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+971 50 123 4567',
    role: 'BROKER' as const,
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  });
  
  // Notification settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  
  // Image viewer
  const [showImageViewer, setShowImageViewer] = useState(false);
  
  const handleEditProfile = async () => {
    // Picker автоматично запитає permissions якщо потрібно
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUser(prev => ({ ...prev, avatar: result.assets[0].uri }));
    }
  };
  
  const handleEditProfilePage = () => {
    router.push('/profile/edit');
  };
  
  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };
  
  const handleNotifications = () => {
    router.push('/profile/notifications');
  };
  
  const handleLanguage = () => {
    router.push('/profile/language');
  };
  
  const handleAppearance = () => {
    router.push('/profile/theme');
  };
  
  const handlePrivacy = () => {
    router.push('/profile/privacy');
  };
  
  const handleTerms = () => {
    router.push('/profile/terms');
  };
  
  const handleHelp = () => {
    router.push('/profile/support');
  };
  
  const handleAbout = () => {
    router.push('/profile/about');
  };
  
  const handleKnowledgeBase = () => {
    router.push('/profile/knowledge-base');
  };
  
  const handleLogout = () => {
    Alert.alert(
      t('profile.logOutConfirmTitle'),
      t('profile.logOutConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.logOut'),
          style: 'destructive',
          onPress: () => {
            // Logout logic
            router.replace('/(auth)/intro');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          avatar={user.avatar}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          role={user.role}
          onEditPress={handleEditProfile}
          onAvatarPress={() => setShowImageViewer(true)}
        />
        
        {/* Account Section */}
        <SettingsSection isFirst>
          <SettingsItem
            icon="person-outline"
            label={t('profile.editProfile')}
            onPress={handleEditProfilePage}
          />
          <SettingsItem
            icon="lock-closed-outline"
            label={t('profile.changePassword')}
            onPress={handleChangePassword}
          />
          <SettingsItem
            icon="call-outline"
            label={t('profile.phoneNumber')}
            value={user.phone}
            hasArrow={false}
            isLast
          />
        </SettingsSection>
        
        {/* Notifications Section */}
        <SettingsSection>
          <SettingsItem
            icon="notifications-outline"
            label={t('profile.pushNotifications')}
            hasSwitch
            switchValue={pushEnabled}
            onSwitchChange={setPushEnabled}
            hasArrow={false}
          />
          <SettingsItem
            icon="mail-outline"
            label={t('profile.emailNotifications')}
            hasSwitch
            switchValue={emailEnabled}
            onSwitchChange={setEmailEnabled}
            hasArrow={false}
          />
          <SettingsItem
            icon="megaphone-outline"
            label={t('profile.marketing')}
            hasSwitch
            switchValue={marketingEnabled}
            onSwitchChange={setMarketingEnabled}
            hasArrow={false}
          />
          <SettingsItem
            icon="settings-outline"
            label={t('profile.notificationPreferences')}
            onPress={handleNotifications}
            isLast
          />
        </SettingsSection>
        
        {/* Preferences Section */}
        <SettingsSection>
          <SettingsItem
            icon="color-palette-outline"
            label={t('profile.appearance')}
            onPress={handleAppearance}
          />
          <SettingsItem
            icon="language-outline"
            label={t('profile.language')}
            value={getLanguageDisplayName()}
            onPress={handleLanguage}
            isLast
          />
        </SettingsSection>
        
        {/* Support Section */}
        <SettingsSection>
          <SettingsItem
            icon="book-outline"
            label="Knowledge Base"
            onPress={handleKnowledgeBase}
          />
          <SettingsItem
            icon="shield-checkmark-outline"
            label={t('profile.privacyPolicy')}
            onPress={handlePrivacy}
          />
          <SettingsItem
            icon="document-text-outline"
            label={t('profile.termsOfService')}
            onPress={handleTerms}
          />
          <SettingsItem
            icon="help-circle-outline"
            label={t('profile.helpAndSupport')}
            onPress={handleHelp}
          />
          <SettingsItem
            icon="information-circle-outline"
            label={t('profile.about')}
            value={`${t('profile.version')} 1.0.0`}
            onPress={handleAbout}
            isLast
          />
        </SettingsSection>
        
        {/* Logout Section */}
        <SettingsSection>
          <SettingsItem
            icon="log-out-outline"
            label={t('profile.logOut')}
            onPress={handleLogout}
            hasArrow={false}
            isLast
          />
        </SettingsSection>
        
        <View style={[styles.footer, { backgroundColor: theme.backgroundSecondary }]} />
      </ScrollView>
      
      {/* Fullscreen Image Viewer */}
      <Modal
        visible={showImageViewer}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageViewer(false)}
      >
        <View style={styles.imageViewerContainer}>
          <Image 
            source={{ uri: user.avatar }} 
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
          
          <Pressable 
            style={({ pressed }) => [
              styles.closeButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => setShowImageViewer(false)}
          >
            <Text style={styles.closeButtonText}>{t('common.close')}</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    height: 24,
  },
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  fullscreenImage: {
    width: '100%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: '#303030',
    backgroundColor: 'transparent',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#939393',
  },
});
