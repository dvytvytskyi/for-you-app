import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useState } from 'react';
import * as Linking from 'expo-linking';
import { buildAmoAuthUrl } from '@/api/amo-crm';

interface AmoCrmAuthScreenProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AmoCrmAuthScreen({ onSuccess, onCancel }: AmoCrmAuthScreenProps) {
  const { theme } = useTheme();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);

      // Побудувати OAuth URL (async)
      const authUrl = await buildAmoAuthUrl();

      // Відкрити системний браузер
      const canOpen = await Linking.canOpenURL(authUrl);
      if (canOpen) {
        await Linking.openURL(authUrl);
        // onSuccess буде викликано після успішного callback
      } else {
        console.error('Cannot open URL:', authUrl);
        alert('Failed to open browser. Please check your settings.');
      }
    } catch (error) {
      console.error('Error opening browser:', error);
      alert('Error opening browser. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.card }]}>
          <Ionicons name="business-outline" size={64} color={theme.primary} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text }]}>
          Connect AMO CRM
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          To work with CRM, you need to connect your AMO CRM account. After clicking the button, you will be redirected to the authorization page.
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Leads synchronization
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Pipeline management
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.textSecondary }]}>
              Task tracking
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={[
              styles.connectButton,
              { backgroundColor: theme.primary },
              isConnecting && styles.buttonDisabled,
            ]}
            onPress={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="link-outline" size={20} color="#FFFFFF" />
                <Text style={styles.connectButtonText}>Connect AMO CRM</Text>
              </>
            )}
          </Pressable>

          {onCancel && (
            <Pressable
              style={[styles.cancelButton, { borderColor: theme.border }]}
              onPress={onCancel}
              disabled={isConnecting}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
