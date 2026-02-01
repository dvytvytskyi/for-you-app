import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Trigger a light haptic feedback.
 * Used for standard button clicks and small interactions.
 */
export const triggerLightHaptic = async () => {
    try {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    } catch (error) {
        // Fail silently if haptics are not supported
    }
};

/**
 * Trigger a medium haptic feedback.
 * Used for more significant actions like opening a modal.
 */
export const triggerMediumHaptic = async () => {
    try {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    } catch (error) {
        // Fail silently
    }
};

/**
 * Trigger a success feedback.
 * Used for actions logically completed successfully.
 */
export const triggerSuccessHaptic = async () => {
    try {
        if (Platform.OS !== 'web') {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    } catch (error) {
        // Fail silently
    }
};
