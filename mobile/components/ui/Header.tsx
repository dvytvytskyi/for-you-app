import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/utils/theme';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  avatar?: string;
  user?: { firstName: string; lastName: string };
  onBack?: () => void;
  showLogo?: boolean;
  onTitlePress?: () => void;
  centered?: boolean;
  titleColor?: string;
  titleSize?: number;
  titleWeight?: any;
  backColor?: string;
  hideRight?: boolean;
  backIconName?: any; // Ionicons name
  backButtonStyle?: any;
}

export default function Header({ title, subtitle, avatar, user, onBack, showLogo, onTitlePress, centered, titleColor, titleSize, titleWeight, backColor, hideRight, backButtonStyle, backIconName, mode = 'default' }: HeaderProps & { mode?: 'default' | 'home' }) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Left side: Back Button */}
      {onBack && (
        <Pressable onPress={onBack} style={[styles.backButton, backButtonStyle]}>
          <Ionicons name={backIconName || "chevron-back"} size={24} color={backColor || theme.primary} />
        </Pressable>
      )}

      {/* Center/Main: Title & Subtitle */}
      <Pressable
        style={[styles.titleContainer, centered && styles.centeredContainer]}
        onPress={onTitlePress}
        disabled={!onTitlePress}
      >
        {mode === 'home' ? (
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.text }}>
              Hello, <Text style={{ color: theme.primary }}>{user?.firstName || 'Guest'}</Text>
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
              <Ionicons name="location-outline" size={14} color={theme.textTertiary} />
              <Text style={{ fontSize: 13, color: theme.textTertiary }}>Dubai, United Arab Emirates</Text>
            </View>
          </View>
        ) : (
          <>
            <Text
              style={[
                styles.title,
                { color: titleColor || theme.primary, fontSize: titleSize || (subtitle ? 17 : 24), fontWeight: titleWeight || '700' },
                centered && styles.centeredText
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.textSecondary },
                  centered && styles.centeredText
                ]}
              >
                {subtitle}
              </Text>
            )}
          </>
        )}
      </Pressable>

      {/* Right side: Avatar or Logo */}
      {!hideRight && (
        <View style={styles.rightContainer}>
          {showLogo ? (
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/images/new logo blue.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <Pressable
              onPress={() => router.push('/profile')}
              style={({ pressed }) => [
                styles.avatarContainer,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : user ? (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
                    {user.firstName?.[0] || ''}{user.lastName?.[0] || ''}
                  </Text>
                </View>
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.border }]}>
                  <Text style={[styles.avatarText, { color: theme.textTertiary }]}>👤</Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      )}
      {hideRight && <View style={styles.rightContainer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 64,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  centeredText: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    marginTop: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 26,
    height: 26,
  },
  avatarContainer: {
    width: 38,
    height: 38,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

