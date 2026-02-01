import { View, StyleSheet, ScrollView, Alert, Modal, Image, Pressable, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { ProfileHeader, SettingsSection, SettingsItem } from '@/components/ui';
import { useTranslation } from '@/utils/i18n';
import { useTheme } from '@/utils/theme';
import { useLanguageStore } from '@/store/languageStore';
import { useAuthStore } from '@/store/authStore';
import { usersApi } from '@/api/users';

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

  // Get user from auth store - використовуємо напряму без fallback
  const { user: authUser, isLoading: authLoading, isAuthenticated } = useAuthStore();

  // Перенаправляємо на інтро якщо не авторизований або завантаження завершено без користувача
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('🔄 User not authenticated, redirecting to intro...');
      router.replace('/(auth)/intro');
    }
  }, [authLoading, isAuthenticated, router]);

  // Використовуємо реальні дані користувача, без мокових fallback
  // Використовуємо avatar з authUser, якщо він є, інакше null
  const user = authUser ? {
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    email: authUser.email,
    phone: authUser.phone,
    role: authUser.role as 'BROKER' | 'INVESTOR' | 'ADMIN' | undefined,
    avatar: authUser.avatar || null, // Використовуємо реальний avatar або null
  } : null;

  // Debug: log user role
  useEffect(() => {
    console.log('=== PROFILE SCREEN ===');
    console.log('authUser:', authUser);
    console.log('authUser?.role:', authUser?.role);
    console.log('authUser?.role type:', typeof authUser?.role);
    console.log('authUser?.role === "INVESTOR":', authUser?.role === 'INVESTOR');
    console.log('Should show Knowledge Base:', authUser && authUser.role !== 'INVESTOR');
  }, [authUser]);

  // Notification settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  // Image viewer
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);


  const handleEditProfile = async () => {
    // Picker автоматично запитає permissions якщо потрібно
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0] && authUser) {
      try {
        setIsUploading(true);
        console.log('🚀 Uploading avatar:', result.assets[0].uri);

        const avatarUrl = await usersApi.uploadAvatar(result.assets[0].uri);
        console.log('✅ Avatar uploaded:', avatarUrl);

        // Оновлюємо локальний стейт authStore
        useAuthStore.setState((state) => ({
          user: state.user ? { ...state.user, avatar: avatarUrl } : null
        }));

        Alert.alert(t('common.success'), 'Avatar updated successfully');
      } catch (error: any) {
        console.error('❌ Avatar upload failed:', error);
        Alert.alert(t('common.error'), error.message || 'Failed to upload avatar');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleEditProfilePage = () => {
    router.push('/profile/edit');
  };

  const handleChangePassword = () => {
    router.push('/profile/change-password');
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

  const navigation = useNavigation();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>




      {authLoading ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading profile...
          </Text>
        </View>
      ) : !user ? (
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            No user data. Redirecting...
          </Text>
        </View>
      ) : (
        <>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Pressable
              style={({ pressed }) => [
                styles.headerBackButton,
                { opacity: pressed ? 0.6 : 1 }
              ]}
              onPress={handleGoBack}
            >
              <Ionicons name="chevron-back" size={24} color={theme.primary} />
            </Pressable>

            <Text style={[styles.headerTitle, { color: theme.text }]}>{t('profile.title') || 'Profile'}</Text>

            <View style={styles.headerBackButton} />
          </View>

          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Back Button Removed from here */}

            <ProfileHeader
              avatar={user.avatar || undefined}
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              role={user.role || 'BROKER'} // Fallback на BROKER якщо роль не визначена
              onEditPress={handleEditProfile}
              onAvatarPress={() => {
                if (user.avatar) {
                  setShowImageViewer(true);
                }
              }}
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
                value={user.phone || undefined}
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
              {/* Only show Knowledge Base if user is explicitly not an INVESTOR and user exists */}
              {authUser && authUser.role !== 'INVESTOR' && (
                <SettingsItem
                  icon="book-outline"
                  label="Knowledge Base"
                  onPress={handleKnowledgeBase}
                />
              )}
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
            <View style={[styles.footer, { backgroundColor: theme.backgroundSecondary }]} />
          </ScrollView>
        </>
      )}

      {/* Fullscreen Image Viewer */}
      {user && user.avatar && (
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
      )}

      {/* Uploading Overlay */}
      {isUploading && (
        <View style={styles.uploadOverlay}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[styles.uploadBox, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.uploadText, { color: theme.text }]}>Uploading avatar...</Text>
          </View>
        </View>
      )}
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
  headerBackButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  uploadBox: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    width: '70%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  uploadText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});
