import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { useQueryClient } from '@tanstack/react-query';

export default function AmoCrmCallbackScreen() {
  const { code, success, state, error: errorParam } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (errorParam) {
      setStatus('error');
      setErrorMessage('Помилка авторизації. Спробуйте ще раз.');
      return;
    }

    // Якщо success=true - backend вже обміняв code на токени
    if (success === 'true') {
      handleCallback(undefined, success);
    } else if (code && typeof code === 'string') {
      // Якщо є code - спробувати обміняти (fallback для старих версій)
      handleCallback(code, undefined);
    } else {
      setStatus('error');
      setErrorMessage('Код авторизації відсутній.');
    }
  }, [code, success, errorParam]);

  const handleCallback = async (code: string | undefined, success: string | undefined) => {
    try {
      setStatus('processing');
      
      // ⚠️ ВАЖЛИВО: Backend вже обміняв code на токени в callback endpoint
      // Токени вже збережені в БД, тому нам не потрібно викликати exchange-code знову
      // Просто оновлюємо статус та повертаємося на CRM сторінку
      
      // Оновити кеш статусу - це викличе GET /api/amo-crm/status
      await queryClient.invalidateQueries({ queryKey: ['amo-crm-status'] });
      
      // Також оновити leads, щоб вони завантажилися
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      setStatus('success');
      
      // Повернутися на CRM сторінку через 1 секунду
      setTimeout(() => {
        router.replace('/(tabs)/crm');
      }, 1000);
    } catch (error: any) {
      console.error('Error processing callback:', error);
      setStatus('error');
      setErrorMessage(
        error?.response?.data?.message || 
        error?.message || 
        'Помилка при обробці підключення до AMO CRM. Спробуйте ще раз.'
      );
    }
  };

  const handleRetry = () => {
    router.replace('/(tabs)/crm');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {status === 'processing' && (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.title, { color: theme.text }]}>
              Підключення до AMO CRM...
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Будь ласка, зачекайте
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={[styles.iconContainer, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Успішно підключено!
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Ваш акаунт AMO CRM успішно підключено. Перенаправлення...
            </Text>
          </>
        )}

        {status === 'error' && (
          <>
            <View style={[styles.iconContainer, { backgroundColor: '#FF3B30' }]}>
              <Ionicons name="close" size={48} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Помилка підключення
            </Text>
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              {errorMessage}
            </Text>
            <Pressable
              style={[styles.retryButton, { backgroundColor: theme.primary }]}
              onPress={handleRetry}
            >
              <Text style={styles.retryButtonText}>Повернутися до CRM</Text>
            </Pressable>
          </>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
