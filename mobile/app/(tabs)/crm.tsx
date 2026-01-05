import { View, Text, StyleSheet, Pressable, ScrollView, Modal, FlatList, Animated, ActivityIndicator, RefreshControl, Alert, LayoutAnimation, Keyboard, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, SearchBar, Dropdown } from '@/components/ui';
import { useTheme } from '@/utils/theme';
import { useTranslation } from '@/utils/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { leadsApi, type Lead as ApiLead } from '@/api/leads';
import { amoCrmApi, type AmoStage } from '@/api/amo-crm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import * as SecureStore from 'expo-secure-store';
import { AddLeadModal } from '@/components/amo-crm/AddLeadModal';

interface Lead {
  id: string;
  name: string;
  price?: number;
  stage: string;

  stageId?: number;
  statusName?: string;
}

// Дефолтні кольори для стадій, якщо в AMO немає
// Генерація унікального кольору для стадії на основі ID або назви
const STAGE_COLORS_PALETTE = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#00BCD4', // Cyan
  '#E91E63', // Pink
  '#3F51B5', // Indigo
  '#009688', // Teal
  '#FFC107', // Amber
  '#673AB7', // Deep Purple
  '#795548', // Brown
  '#607D8B', // Blue Grey
  '#FF5722', // Deep Orange
  '#8BC34A', // Light Green
];

const getStageColor = (identifier: string | number) => {
  let hash = 0;
  const str = String(identifier);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % STAGE_COLORS_PALETTE.length);
  return STAGE_COLORS_PALETTE[index];
};

const DEFAULT_STAGE_COLORS: Record<string, string> = {
  'NEW': '#4CAF50',
  'IN_PROGRESS': '#2196F3',
  'CLOSED': '#607D8B',
  'SUCCESS': '#4CAF50',
  'FAIL': '#F44336',
};

export default function CRMScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [selectedPipeline, setSelectedPipeline] = useState<number | null>(null);
  const [filterModalStep, setFilterModalStep] = useState<'pipeline' | 'stage'>('pipeline');
  const [modalVisible, setModalVisible] = useState(false);
  const [addLeadModalVisible, setAddLeadModalVisible] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

  // Перевірка авторизації
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const queryClient = useQueryClient();

  // Оновити leads при фокусі на сторінку
  useFocusEffect(
    useCallback(() => {
      // Оновити leads при поверненні на сторінку
      if (!authLoading && isAuthenticated) {
        refetchLeads();
      }
    }, [authLoading, isAuthenticated])
  );

  // Завантаження leads
  const { data: leadsData, isLoading: leadsLoading, error: leadsError, refetch: refetchLeads } = useQuery({
    queryKey: ['leads', {
      status: selectedStage || undefined,
      stageId: selectedStageId || undefined,
      pipelineId: selectedPipeline || undefined,
    }],
    queryFn: async () => {
      try {
        console.log('🔄 Завантаження leads...');
        console.log('👤 Користувач:', authUser?.email, 'Роль:', authUser?.role);
        console.log('🔐 Авторизований:', isAuthenticated);

        // Перевірка токену
        const token = await SecureStore.getItemAsync('accessToken');
        if (!token) {
          throw new Error('Токен авторизації відсутній. Будь ласка, увійдіть знову.');
        }

        // Формуємо фільтри
        const filters: {
          limit: number;
          page?: number;
          status?: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
          pipelineId?: number;
          stageId?: number;
        } = {
          limit: 100, // Збільшуємо limit, щоб отримати більше лідів
          page: 1,
        };

        // Додаємо pipelineId якщо обрано pipeline
        if (selectedPipeline) {
          filters.pipelineId = selectedPipeline;
          console.log('✅ Використовується фільтр по pipelineId:', selectedPipeline);
        }

        // Додаємо stageId якщо обрано конкретну стадію з AMO CRM (має пріоритет над status)
        if (selectedStageId) {
          filters.stageId = selectedStageId;
          console.log('✅ Використовується фільтр по stageId:', selectedStageId);
        } else if (selectedStage && ['NEW', 'IN_PROGRESS', 'CLOSED'].includes(selectedStage)) {
          // Додаємо status тільки якщо selectedStage валідний стандартний статус і немає stageId
          filters.status = selectedStage as 'NEW' | 'IN_PROGRESS' | 'CLOSED';
          console.log('✅ Використовується фільтр по status:', selectedStage);
        }

        console.log('🔍 Filters for leads request:', filters);
        console.log('📊 selectedStage value:', selectedStage);
        console.log('📊 selectedStageId:', selectedStageId);
        console.log('🔑 Token check:', {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
        });

        const result = await leadsApi.getAll(filters);

        // Детальне логування відповіді
        console.log('✅ Leads завантажено:', {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          dataLength: result.data?.length || 0,
          filtersUsed: filters,
        });

        // Перевірка структури відповіді
        if (!result.data || !Array.isArray(result.data)) {
          console.error('❌ Відповідь не містить масив data:', result);
          throw new Error('Невірний формат відповіді від сервера');
        }

        console.log('📋 Leads data (перші 10):', result.data.slice(0, 10).map(l => ({
          id: l.id,
          name: l.guestName,
          status: l.status,
          pipelineId: (l as any).pipelineId,
          stageId: (l as any).stageId,
          amoLeadId: l.amoLeadId
        })));
        console.log('📊 Усі статуси leads:', [...new Set(result.data.map(l => l.status))]);
        console.log('📊 Унікальні pipelineId:', [...new Set(result.data.map((l: any) => l.pipelineId).filter(Boolean))]);
        console.log('📊 Унікальні stageId:', [...new Set(result.data.map((l: any) => l.stageId).filter(Boolean))]);

        // Перевірка, чи повертається правильна кількість лідів
        if (result.total > 0 && result.data.length < result.total && result.data.length < filters.limit) {
          console.warn('⚠️ Повернуто менше лідів, ніж очікувалось:', {
            expected: Math.min(result.total, filters.limit),
            received: result.data.length,
            total: result.total,
            filters: filters,
          });
        }

        // Якщо повертається менше лідів, ніж total, можливо потрібна пагінація
        if (result.total > result.data.length && result.totalPages > 1) {
          console.log('ℹ️ Є більше сторінок. Загальна кількість:', result.total, 'Сторінок:', result.totalPages);
        }

        return result;
      } catch (error: any) {
        console.error('❌ Помилка завантаження leads:', error);
        console.error('📋 Error details:', {
          message: error?.message,
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          url: error?.config?.url,
          baseURL: error?.config?.baseURL,
          fullUrl: error?.config?.baseURL ? `${error?.config?.baseURL}${error?.config?.url}` : error?.config?.url,
          method: error?.config?.method,
          headers: error?.config?.headers,
          params: error?.config?.params,
        });
        console.error('📄 Response data:', error?.response?.data);
        console.error('📄 Response headers:', error?.response?.headers);

        // Форматуємо повідомлення про помилку
        let errorMessage = 'Помилка завантаження leads';
        if (error?.response?.status === 401) {
          errorMessage = 'Користувач не авторизований. Будь ласка, увійдіть знову.';
        } else if (error?.response?.status === 403) {
          errorMessage = 'Немає доступу до цього ресурсу.';
        } else if (error?.response?.status === 500) {
          // Для 500 помилки показуємо детальну інформацію
          const serverMessage = error?.response?.data?.message || error?.response?.data?.error || 'Внутрішня помилка сервера';
          errorMessage = `Помилка сервера (500): ${serverMessage}`;
          console.error('🔴 Server error details:', serverMessage);
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        const formattedError = new Error(errorMessage);
        (formattedError as any).response = error?.response;
        (formattedError as any).config = error?.config;
        throw formattedError;
      }
    },
    retry: 1,
    retryDelay: 2000,
    enabled: !authLoading && isAuthenticated, // Чекаємо завантаження авторизації
  });

  // Завантаження pipelines та stages (тільки якщо AMO CRM підключено)
  // ⚠️ ВАЖЛИВО: Stages вже включені в відповідь /api/amo-crm/pipelines, не потрібно робити окремі запити!
  const { data: pipelinesData, isLoading: pipelinesLoading, error: pipelinesError } = useQuery({
    queryKey: ['amo-pipelines'],
    queryFn: async () => {
      try {
        console.log('🔄 Завантаження pipelines (з stages)...');
        const pipelines = await amoCrmApi.getPipelines();
        console.log('✅ Pipelines завантажено:', pipelines.data.length);

        // Stages вже включені в відповідь, просто перевіряємо та логуємо
        pipelines.data.forEach((pipeline) => {
          const stagesCount = pipeline.stages?.length || 0;
          console.log(`📊 Pipeline ${pipeline.id} (${pipeline.name}): ${stagesCount} stages`);
        });

        const totalStages = pipelines.data.reduce((sum, p) => sum + (p.stages?.length || 0), 0);
        console.log(`✅ Всього stages завантажено: ${totalStages}`);

        return pipelines;
      } catch (error: any) {
        console.error('❌ Error loading pipelines:', error);
        console.error('📋 Error details:', {
          status: error?.response?.status,
          message: error?.message,
          data: error?.response?.data,
        });
        throw error;
      }
    },
    enabled: !authLoading && isAuthenticated, // Завантажуємо leads навіть без AMO CRM
    retry: 1,
    retryDelay: 2000,
  });



  // Конвертуємо API leads в формат для відображення
  const leads: Lead[] = leadsData?.data?.map((lead: ApiLead) => ({
    id: lead.id,
    name: lead.guestName || 'Без імені',
    price: lead.price,
    stage: lead.status,

    stageId: (lead as any).stageId,
    statusName: lead.statusName,
  })) || [];

  // Формуємо список стадій з AMO CRM
  const allStages: Array<{ label: string; value: string; color: string; id?: number }> = [];
  if (pipelinesData?.data && Array.isArray(pipelinesData.data)) {
    console.log('🔍 Обробка pipelines:', pipelinesData.data.length);
    pipelinesData.data.forEach((pipeline) => {
      console.log(`🔍 Pipeline ${pipeline.id} (${pipeline.name}):`, {
        hasStages: !!pipeline.stages,
        stagesCount: pipeline.stages?.length || 0,
        stages: pipeline.stages,
      });

      if (pipeline && pipeline.stages && Array.isArray(pipeline.stages) && pipeline.stages.length > 0) {
        pipeline.stages.forEach((stage: AmoStage) => {
          // Перевірка на валідність stage
          if (stage && stage.id && stage.name) {
            // Уникаємо дублікатів
            if (!allStages.find(s => s.id === stage.id)) {
              allStages.push({
                label: String(stage.name),
                value: stage.mappedStatus || String(stage.name),
                color: stage.color || DEFAULT_STAGE_COLORS[stage.mappedStatus || ''] || getStageColor(stage.id || stage.name),
                id: stage.id,
              });
              console.log(`✅ Додано stage: ${stage.name} (id: ${stage.id})`);
            } else {
              console.log(`⚠️ Пропущено дублікат stage: ${stage.name} (id: ${stage.id})`);
            }
          } else {
            console.warn('⚠️ Невалідний stage:', stage);
          }
        });
      } else {
        console.log(`⚠️ Pipeline ${pipeline.id} не має stages`);
      }
    });
  } else {
    console.log('⚠️ Немає pipelines data або це не масив');
  }

  // Логування для діагностики
  console.log('📊 Pipelines data summary:', {
    hasData: !!pipelinesData,
    dataLength: pipelinesData?.data?.length || 0,
    allStagesCount: allStages.length,
    allStages: allStages.map(s => ({ label: s.label, id: s.id })),
    pipelinesLoading,
    pipelinesError: pipelinesError ? (pipelinesError as any)?.message : null,
  });

  // Додаємо дефолтні стадії, якщо немає з AMO
  const LEAD_STAGES = allStages.length > 0
    ? allStages
    : [
      { label: 'New', value: 'NEW', color: '#4CAF50' },
      { label: 'In Progress', value: 'IN_PROGRESS', color: '#2196F3' },
      { label: 'Closed', value: 'CLOSED', color: '#607D8B' },
    ];

  const leadCount = leadsData?.total || 0;

  // Фільтрація пошуку
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchLeads()]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const slideAnim = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      // Скидаємо тільки стан модалки
      setFilterModalStep('pipeline');
    });
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 120,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const handleSelectPipeline = (pipelineId: number) => {
    setSelectedPipeline(pipelineId);
    // При виборі воронки скидаємо стадію, але ставимо фільтр активним
    setSelectedStage('');
    setSelectedStageId(null);
    setFilterActive(true);
    setFilterModalStep('stage');
  };

  const handleSelectStage = (value: string, stageId?: number) => {
    console.log('🎯 Вибір стадії:', { value, stageId, currentPipeline: selectedPipeline });
    setSelectedStage(value);
    setSelectedStageId(stageId || null);
    setFilterActive(value !== '' || selectedPipeline !== null);
    closeModal();
    // НЕ скидаємо pipeline - він має залишитися для фільтрації
    // setSelectedPipeline(null); // Видалено - pipeline має залишитися
    setFilterModalStep('pipeline');
    // Оновлюємо leads з новим фільтром
    setTimeout(() => {
      refetchLeads();
    }, 100);
  };

  const handleToggleFilter = () => {
    if (filterActive) {
      // Скидаємо всі фільтри
      setSelectedStage('');
      setSelectedStageId(null);
      setSelectedPipeline(null);
      setFilterActive(false);
      setFilterModalStep('pipeline');
    } else {
      // Відкриваємо модалку з початкового кроку
      setFilterModalStep('pipeline');
      // НЕ скидаємо selectedPipeline - можливо користувач хоче змінити тільки stage
      setModalVisible(true);
    }
  };



  const handleBackToPipelines = () => {
    setFilterModalStep('pipeline');
    setSelectedPipeline(null);
  };

  const handleSearchFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(true);
  };

  const handleCancelSearch = () => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const LeadCard = ({ item }: { item: Lead }) => {
    // Безпечний пошук стадії
    const stage = LEAD_STAGES.find(s => {
      if (!s || !s.value || !item.stage) return false;
      return s.value === item.stage || s.label?.toLowerCase() === String(item.stage).toLowerCase();
    });

    const formatPrice = (price?: number) => {
      if (!price || isNaN(price)) return '—';
      return new Intl.NumberFormat('en-US').format(price);
    };

    // Безпечне отримання назви стадії
    const stageLabel = item.statusName || stage?.label || (typeof item.stage === 'string' ? item.stage : 'Unknown') || 'Unknown';
    const stageColor = stage?.color || getStageColor(item.stageId || item.stage);
    const leadName = item.name || 'Без імені';

    return (
      <Pressable
        onPress={() => router.push(`/lead/${item.id}`)}
        style={[styles.leadCard, { borderColor: theme.border, backgroundColor: theme.card }]}
      >
        <View style={styles.leadTopRow}>
          <Text
            style={[styles.leadName, { color: theme.primary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {String(leadName)}
          </Text>
          {typeof item.price === 'number' && (
            <Text style={[styles.leadPrice, { color: theme.textSecondary }]}>
              {formatPrice(item.price)} $
            </Text>
          )}
        </View>
        <View style={styles.leadBottomRow}>
          <View style={[styles.stageTag, { backgroundColor: String(stageColor) }]}>
            <Text style={styles.stageTagText}>{String(stageLabel)}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color={theme.textSecondary} />
        </View>
      </Pressable>
    );
  };

  // Determine if search section should be shown
  const showSearch = (authUser?.amoCrmUserId || authLoading);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={showSearch ? [1] : []}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        {/* Index 0: Main Header - Will scroll away */}
        <View>
          <Header
            title={t('tabs.crm.title')}
            titleColor="#FFFFFF"
            user={authUser || undefined}
            avatar={authUser?.avatar || undefined}
          />
        </View>

        {/* Index 1: Search & Filter Section - Will become sticky */}
        {showSearch && (
          <View style={[styles.fixedSection, { backgroundColor: 'transparent' }]}>
            {/* Search, Stage Filter, and Add Button */}
            <View style={styles.searchRow}>
              <View style={styles.searchBarContainer}>
                <BlurView intensity={50} tint="dark" style={{ borderRadius: 8, overflow: 'hidden' }}>
                  <SearchBar
                    inputRef={searchInputRef as any}
                    value={searchQuery}
                    onFocus={handleSearchFocus}
                    onChangeText={setSearchQuery}
                    placeholder={t('tabs.crm.findByName')}
                    backgroundColor="rgba(255,255,255,0.05)"
                  />
                </BlurView>
              </View>

              {isSearchFocused ? (
                <Pressable onPress={handleCancelSearch} style={{ paddingHorizontal: 4, justifyContent: 'center' }}>
                  <Text style={{ color: theme.primary, fontSize: 16 }}>{t('common.cancel') || 'Cancel'}</Text>
                </Pressable>
              ) : (
                <>
                  <BlurView intensity={50} tint="dark" style={{ borderRadius: 8, overflow: 'hidden' }}>
                    <Pressable
                      style={[
                        styles.filterButton,
                        {
                          borderColor: filterActive ? theme.primary : 'transparent',
                          backgroundColor: filterActive ? theme.primary : 'rgba(255,255,255,0.05)'
                        }
                      ]}
                      onPress={handleToggleFilter}
                    >
                      <Ionicons
                        name="filter"
                        size={20}
                        color={filterActive ? '#FFFFFF' : theme.text}
                      />
                    </Pressable>
                  </BlurView>

                  <BlurView intensity={0} tint="dark" style={{ borderRadius: 8, overflow: 'hidden' }}>
                    <Pressable
                      style={[styles.addButton, { backgroundColor: theme.primary }]}
                      onPress={() => setAddLeadModalVisible(true)}
                    >
                      <Ionicons name="add" size={24} color="#FFFFFF" />
                    </Pressable>
                  </BlurView>
                </>
              )}
            </View>
          </View>
        )}

        {/* Index 2: Lead Count - Will scroll away (Index changes based on rendering, but logic holds) */}
        {showSearch && (
          <View style={styles.countContainer}>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Text style={[styles.countText, { color: theme.textSecondary }]}>
              {leadCount} leads found
            </Text>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </View>
        )}

        {/* Index 3: Content Area */}
        <View style={styles.content}>
          {authLoading ? (
            <View style={[styles.loadingContainer]}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Перевірка авторизації...
              </Text>
            </View>
          ) : !isAuthenticated ? (
            <View style={[styles.errorContainer]}>
              <Ionicons name="lock-closed-outline" size={64} color="#FF3B30" />
              <Text style={[styles.errorText, { color: theme.text }]}>
                Потрібна авторизація
              </Text>
              <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
                Для доступу до CRM потрібно увійти в систему
              </Text>
              <Pressable
                style={[styles.secondaryButton, { borderColor: theme.border, marginTop: 12 }]}
                onPress={() => router.push('/(auth)/intro')}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Зареєструватися</Text>
              </Pressable>
            </View>
          ) : (!authUser?.amoCrmUserId && !authLoading) ? (
            <View style={[styles.errorContainer, { justifyContent: 'center', alignItems: 'center', padding: 24, paddingBottom: 100 }]}>
              <Ionicons name="alert-circle-outline" size={64} color={theme.textSecondary} />
              <Text style={[styles.errorText, { color: theme.text, textAlign: 'center', marginTop: 16, fontSize: 18, fontWeight: '600' }]}>
                You do not own crm account.
              </Text>
              <Text style={[styles.errorSubtext, { color: theme.textSecondary, textAlign: 'center', marginTop: 8, fontSize: 14 }]}>
                Contact your admin
              </Text>
            </View>
          ) : leadsLoading ? (
            <View style={[styles.loadingContainer]}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                Завантаження leads...
              </Text>
            </View>
          ) : leadsError ? (
            <View style={[styles.errorContainer]}>
              <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
              <Text style={[styles.errorText, { color: theme.text }]}>
                Помилка завантаження leads
              </Text>
              <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
                {(leadsError as any)?.message || (leadsError as any)?.response?.data?.message || 'Спробуйте оновити'}
              </Text>
              <Pressable
                style={[styles.retryButton, { backgroundColor: theme.primary }]}
                onPress={() => refetchLeads()}
              >
                <Text style={styles.retryButtonText}>Спробувати знову</Text>
              </Pressable>
            </View>
          ) : filteredLeads.length === 0 ? (
            <View style={[styles.emptyContainer]}>
              <Ionicons name="document-outline" size={64} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {searchQuery ? 'Leads не знайдено' : 'Немає leads'}
              </Text>
            </View>
          ) : (
            <View>
              {filteredLeads.map((lead) => (
                <LeadCard key={lead.id} item={lead} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Stage Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View
          style={[
            styles.modalBackdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={closeModal}
          />
          <Animated.View
            style={[
              styles.modalContent,
              styles.modalContentTall,
              {
                transform: [{ translateY: slideUp }],
                backgroundColor: theme.background,
              },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              {filterModalStep === 'stage' && (
                <Pressable onPress={handleBackToPipelines} style={styles.modalBackButton}>
                  <Ionicons name="arrow-back" size={24} color={theme.primary} />
                </Pressable>
              )}
              <Text style={[styles.modalTitle, { color: theme.primary, flex: 1 }]}>
                {filterModalStep === 'pipeline' ? 'Select pipeline' : 'Select stage'}
              </Text>
              <Pressable onPress={closeModal} style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={theme.primary} />
              </Pressable>
            </View>

            {filterModalStep === 'pipeline' ? (
              <FlatList
                data={pipelinesData?.data || []}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => {
                  const pipelineName = String(item.name || 'Без назви');
                  const stagesCount = item.stages?.length || 0;
                  return (
                    <Pressable
                      style={[
                        styles.modalItem,
                        { borderBottomColor: theme.border },
                        selectedPipeline === item.id && { backgroundColor: theme.card },
                      ]}
                      onPress={() => handleSelectPipeline(item.id)}
                    >
                      <View style={styles.modalItemContent}>
                        <Text style={[styles.modalItemText, { color: theme.primary, fontSize: 14 }]}>
                          {pipelineName}
                        </Text>
                        {stagesCount > 0 && (
                          <Text style={[styles.modalItemSubtext, { color: theme.textSecondary }]}>
                            {stagesCount} стадій
                          </Text>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={theme.primary} />
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.modalEmptyContainer}>
                    <Ionicons name="folder-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.modalEmptyText, { color: theme.textSecondary }]}>
                      Немає доступних воронок
                    </Text>
                  </View>
                }
              />
            ) : (
              <FlatList
                data={
                  pipelinesData?.data
                    ?.find((p) => p.id === selectedPipeline)
                    ?.stages?.map((stage) => ({
                      label: String(stage.name || 'Без назви'),
                      value: stage.mappedStatus || String(stage.name || ''),
                      color: stage.color || '#999',
                      id: stage.id,
                    })) || []
                }
                contentContainerStyle={{ paddingBottom: 32 }}
                ListHeaderComponent={() => (
                  <Pressable
                    style={[
                      styles.modalItem,
                      { borderBottomColor: theme.border },
                      selectedStage === '' && { backgroundColor: theme.card },
                    ]}
                    onPress={() => handleSelectStage('', undefined)}
                  >
                    <View style={styles.modalItemContent}>
                      <View style={[styles.stageColorIndicator, { backgroundColor: theme.textSecondary }]} />
                      <Text style={[styles.modalItemText, { color: theme.primary, fontSize: 14 }]}>
                        All stages
                      </Text>
                    </View>
                    {selectedStage === '' && (
                      <Ionicons name="checkmark" size={20} color={theme.primary} />
                    )}
                  </Pressable>
                )}
                keyExtractor={(item) => String(item.id || item.value || Math.random())}
                renderItem={({ item }) => {
                  const itemLabel = String(item.label || item.value || 'Unknown');
                  const itemValue = String(item.value || item.label || '');
                  return (
                    <Pressable
                      style={[
                        styles.modalItem,
                        { borderBottomColor: theme.border },
                      ]}
                      onPress={() => handleSelectStage(itemValue, item.id)}
                    >
                      <View style={styles.modalItemContent}>
                        <View style={[styles.stageColorIndicator, { backgroundColor: item.color }]} />
                        <Text style={[styles.modalItemText, { color: theme.primary, fontSize: 14 }]}>
                          {itemLabel}
                        </Text>
                      </View>
                      {selectedStage === itemValue && (
                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                      )}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.modalEmptyContainer}>
                    <Ionicons name="list-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.modalEmptyText, { color: theme.textSecondary }]}>
                      Немає доступних стадій
                    </Text>
                  </View>
                }
              />
            )}
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Add Lead Modal */}
      <AddLeadModal
        visible={addLeadModalVisible}
        onClose={() => setAddLeadModalVisible(false)}
        onSuccess={() => {
          refetchLeads();
        }}
        amoConnected={true}
      />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedSection: {
    padding: 16,
    paddingBottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
    alignItems: 'center',
    height: 48,
  },
  searchBarContainer: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 16,
    minHeight: 30,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  countText: {
    fontSize: 14,
    paddingHorizontal: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 400,
  },
  modalContentTall: {
    maxHeight: 600,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  modalBackButton: {
    padding: 4,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalItemSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  stageColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalEmptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  modalEmptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  lastModalItem: {
    paddingBottom: 32,
  },
  modalItemText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  leadCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  leadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: '10%',
  },
  leadPrice: {
    fontSize: 14,
  },
  stageTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  stageTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  connectBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  connectBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectBannerText: {
    flex: 1,
    fontSize: 14,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 12,
  },
});

