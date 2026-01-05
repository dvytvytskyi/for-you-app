import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, AppState, AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';

export const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

interface BiometricProtectionProps {
    children: React.ReactNode;
}

export function BiometricProtection({ children }: BiometricProtectionProps) {
    const { theme } = useTheme();
    const [isLocked, setIsLocked] = useState(false); // Default false, will check on mount
    const [isChecking, setIsChecking] = useState(true);
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    const checkBiometricStatus = useCallback(async () => {
        try {
            const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);

            if (enabled !== 'true') {
                setIsLocked(false);
                setIsChecking(false);
                return;
            }

            // Check if hardware supports it
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();

            if (!compatible || !enrolled) {
                // Hardware not available or no biometrics set up, unlock regardless of setting
                setIsLocked(false);
                setIsChecking(false);
                return;
            }

            setIsLocked(true);
            authenticate();
        } catch (error) {
            console.error('Biometric check error:', error);
            setIsLocked(false);
        } finally {
            setIsChecking(false);
        }
    }, []);

    const authenticate = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock For You App',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
            });

            if (result.success) {
                setIsLocked(false);
            } else {
                // User cancelled or failed multiple times
                // We stay locked. User can tap button to retry.
            }
        } catch (error) {
            console.error('Authentication error:', error);
        }
    };

    useEffect(() => {
        checkBiometricStatus();
    }, [checkBiometricStatus]);

    // Lock when app comes to foreground? 
    // Optional: For now let's just do it on initial load to avoid annoyance
    // Uncomment below to lock on every resume
    /*
    useEffect(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
           // Re-check lock status
           checkBiometricStatus();
        }
        setAppState(nextAppState);
      });
  
      return () => {
        subscription.remove();
      };
    }, [appState, checkBiometricStatus]);
    */

    if (isChecking) {
        // Show splash-like screen or nothing
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (isLocked) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Ionicons name="lock-closed-outline" size={64} color={theme.primary} />
                <Text style={[styles.title, { color: theme.text }]}>Locked</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Please authenticate to continue
                </Text>

                <Pressable
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={authenticate}
                >
                    <Text style={styles.buttonText}>Unlock</Text>
                </Pressable>
            </View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
