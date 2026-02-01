import { View, Text, StyleSheet, Pressable, ScrollView, Modal, FlatList, Animated, ActivityIndicator, RefreshControl, Alert, LayoutAnimation, Keyboard, TextInput, Dimensions, PanResponder } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  const { theme, isDark } = useTheme();
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
  const scrollY = useRef(new Animated.Value(0)).current;
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
    name: lead.guestName || 'No name',
    price: lead.price,
    stage: lead.status,

    stageId: (lead as any).stageId,
    statusName: lead.statusName,
  })) || [];

  // Формуємо список стадій з AMO CRM
  const allStages: Array<{
    label: string;
    value: string;
    color: string;
    id?: number;
    pipelineId: number;
    pipelineName: string;
  }> = [];
  const ALLOWED_PIPELINES = ['Real Estate', 'Партнеры', 'Vladimir Team'];

  if (pipelinesData?.data && Array.isArray(pipelinesData.data)) {
    const filteredPipelines = pipelinesData.data.filter(p =>
      ALLOWED_PIPELINES.some(name => p.name?.toLowerCase().includes(name.toLowerCase()))
    );

    filteredPipelines.forEach((pipeline) => {
      if (pipeline && pipeline.stages && Array.isArray(pipeline.stages)) {
        pipeline.stages.forEach((stage: AmoStage) => {
          if (stage && stage.id && stage.name) {
            if (!allStages.find(s => s.id === stage.id)) {
              allStages.push({
                label: String(stage.name),
                value: stage.mappedStatus || String(stage.name),
                color: stage.color || DEFAULT_STAGE_COLORS[stage.mappedStatus || ''] || getStageColor(stage.id || stage.name),
                id: stage.id,
                pipelineId: pipeline.id,
                pipelineName: pipeline.name
              });
            }
          }
        });
      }
    });
  }

  // Додаємо дефолтні стадії, якщо немає з AMO
  const currentPipelineId = selectedPipeline || (allStages.length > 0 ? allStages[0].pipelineId : null);

  const LEAD_STAGES = allStages.filter(s => s.pipelineId === currentPipelineId);
  const UI_PIPELINES = Array.from(new Set(allStages.map(s => JSON.stringify({ id: s.pipelineId, name: s.pipelineName }))))
    .map(s => JSON.parse(s));

  if (LEAD_STAGES.length === 0 && allStages.length === 0) {
    // Fallback if no pipelines at all
    (LEAD_STAGES as any).push(
      { label: 'New', value: 'NEW', color: '#4CAF50', pipelineId: 0, pipelineName: 'Default' },
      { label: 'In Progress', value: 'IN_PROGRESS', color: '#2196F3', pipelineId: 0, pipelineName: 'Default' },
      { label: 'Closed', value: 'CLOSED', color: '#607D8B', pipelineId: 0, pipelineName: 'Default' },
    );
  }

  // Логування для діагностики
  console.log('📊 Pipelines data summary:', {
    hasData: !!pipelinesData,
    dataLength: pipelinesData?.data?.length || 0,
    allStagesCount: allStages.length,
    allStages: allStages.map(s => ({ label: s.label, id: s.id })),
    pipelinesLoading,
    pipelinesError: pipelinesError ? (pipelinesError as any)?.message : null,
    LEAD_STAGES_COUNT: LEAD_STAGES.length,
  });

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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const currentStageIndex = LEAD_STAGES.findIndex(s => s.id === selectedStageId || (selectedStage && s.value === selectedStage));

  // Robust translation fallbacks to avoid [missing translation] messages
  const getAllStagesLabel = () => {
    const label = t('tabs.crm.allStages');
    return (label && !label.includes('missing')) ? label : 'All Stages';
  };

  const getLeadsFoundLabel = (count: number) => {
    const label = t('tabs.crm.leadsFound', { count });
    if (label && !label.includes('missing')) return label;
    return `${count} leads found`;
  };

  const currentStageLabel = currentStageIndex !== -1 ? LEAD_STAGES[currentStageIndex].label : getAllStagesLabel();

  const currentPipeline = UI_PIPELINES.find(p => p.id === currentPipelineId);
  const currentPipelineName = currentPipeline?.name || 'Default';

  // Animation values for pipeline switcher
  const pipelineTranslateX = useRef(new Animated.Value(0)).current;

  // Calculate generic prev/next pipelines for display
  const currentPipelineIdx = UI_PIPELINES.findIndex(p => p.id === currentPipelineId);
  const activeIdx = currentPipelineIdx === -1 ? 0 : currentPipelineIdx;

  const prevPipeline = UI_PIPELINES.length > 0 ? UI_PIPELINES[(activeIdx - 1 + UI_PIPELINES.length) % UI_PIPELINES.length] : null;
  const nextPipeline = UI_PIPELINES.length > 0 ? UI_PIPELINES[(activeIdx + 1) % UI_PIPELINES.length] : null;

  const handlePrevStage = () => {


    if (LEAD_STAGES.length === 0) return;
    let newIndex;
    if (currentStageIndex === -1) newIndex = LEAD_STAGES.length - 1;
    else newIndex = currentStageIndex - 1; // -1 becomes "All Stages"

    if (newIndex === -1) handleSelectStage('', undefined);
    else handleSelectStage(LEAD_STAGES[newIndex].value, LEAD_STAGES[newIndex].id);
  };


  // Pipeline navigation handlers
  const handlePrevPipeline = () => {
    if (!UI_PIPELINES || UI_PIPELINES.length <= 1) return;
    const currentIndex = UI_PIPELINES.findIndex(p => p.id === selectedPipeline);
    // If nothing selected or not found, current is effectively 0 (default) or -1.
    // Logic: if current is 0, go to last.
    // If selectedPipeline is null, we assume we are on the first one or "default".
    // Let's assume UI_PIPELINES covers all valid pipelines.

    let effectiveIndex = currentIndex === -1 ? 0 : currentIndex;
    let newIndex = effectiveIndex - 1;
    if (newIndex < 0) newIndex = UI_PIPELINES.length - 1;

    // Animate slide right (content moves right because we go previous)
    Animated.sequence([
      Animated.timing(pipelineTranslateX, {
        toValue: 20, // Slide right
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pipelineTranslateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      })
    ]).start();

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    handleSelectPipeline(UI_PIPELINES[newIndex].id);
  };

  const handleNextPipeline = () => {
    if (!UI_PIPELINES || UI_PIPELINES.length <= 1) return;
    const currentIndex = UI_PIPELINES.findIndex(p => p.id === selectedPipeline);

    let effectiveIndex = currentIndex === -1 ? 0 : currentIndex;
    let newIndex = effectiveIndex + 1;
    if (newIndex >= UI_PIPELINES.length) newIndex = 0;

    // Animate slide left (content moves left because we go next)
    Animated.sequence([
      Animated.timing(pipelineTranslateX, {
        toValue: -20, // Slide left
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pipelineTranslateX, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      })
    ]).start();

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    handleSelectPipeline(UI_PIPELINES[newIndex].id);
  };

  const pipelineHandlersRef = useRef({ handlePrevPipeline, handleNextPipeline });
  pipelineHandlersRef.current = { handlePrevPipeline, handleNextPipeline };

  const pipelinePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 30) {
          pipelineHandlersRef.current.handlePrevPipeline();
        } else if (gestureState.dx < -30) {
          pipelineHandlersRef.current.handleNextPipeline();
        }
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const handleNextStage = () => {
    if (LEAD_STAGES.length === 0) return;
    let newIndex;
    if (currentStageIndex === LEAD_STAGES.length - 1) newIndex = -1;
    else newIndex = currentStageIndex + 1;

    if (newIndex === -1) handleSelectStage('', undefined);
    else handleSelectStage(LEAD_STAGES[newIndex].value, LEAD_STAGES[newIndex].id);
  };

  // Ref for handlers to avoid stale closures in PanResponder
  const handlersRef = useRef({ handlePrevStage, handleNextStage });
  // Update ref on every render
  handlersRef.current = { handlePrevStage, handleNextStage };

  const panResponder = useRef(
    PanResponder.create({
      // Використовуємо Capture, щоб перехопити подію ДО того, як її отримає ScrollView
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        const { dx, dy } = gestureState;
        // Перехоплюємо, якщо рух горизонтальний і достатньо сильний
        // Поріг 10px дозволяє відсіяти випадкові натискання
        // dx > dy гарантує, що ми не блокуємо вертикальний скрол
        return Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        // Поріг 50px для спрацьовування перемикання
        if (dx > 50) {
          handlersRef.current.handlePrevStage();
        } else if (dx < -50) {
          handlersRef.current.handleNextStage();
        }
      },
      onPanResponderTerminationRequest: () => false, // Не віддавати контроль іншим
    })
  ).current;

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
    const leadName = item.name || 'No name';

    return (
      <Pressable
        onPress={() => router.push(`/lead/${item.id}`)}
        style={[styles.leadCard, { borderColor: theme.border, backgroundColor: theme.card }]}
      >
        <View style={styles.leadRowMain}>
          <View style={[styles.leadAvatar, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.leadAvatarText, { color: theme.primary }]}>
              {leadName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Text>
          </View>

          <View style={styles.leadInfo}>
            <Text style={[styles.leadNameNew, { color: theme.text }]} numberOfLines={1}>
              {leadName}
            </Text>
            <View style={styles.leadDetailsRow}>
              {typeof item.price === 'number' && (
                <Text style={[styles.leadPriceNew, { color: theme.textSecondary }]}>
                  {formatPrice(item.price)} $
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.viewButton, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
            <Text style={[styles.viewButtonText, { color: theme.primary }]}>View</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  // Determine if search section should be shown
  const showSearch = (authUser?.amoCrmUserId || authLoading);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 150 }}
          stickyHeaderIndices={showSearch ? [0] : []}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY as any } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
        >


          {/* Index 1: Search & Filter Section - Will become sticky */}
          {showSearch && (
            <View style={[styles.fixedSection, { backgroundColor: theme.background }]}>
              <View style={styles.searchRow}>
                <View style={styles.searchBarContainer}>
                  <SearchBar
                    inputRef={searchInputRef as any}
                    value={searchQuery}
                    onFocus={handleSearchFocus}
                    onChangeText={setSearchQuery}
                    placeholder={t('tabs.crm.findByName')}
                  />
                </View>

                {isSearchFocused ? (
                  <Pressable onPress={handleCancelSearch} style={{ paddingHorizontal: 4, justifyContent: 'center' }}>
                    <Text style={{ color: theme.primary, fontSize: 16 }}>{t('common.cancel') || 'Cancel'}</Text>
                  </Pressable>
                ) : (
                  <>
                    <Pressable
                      style={[
                        styles.filterButton,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.card
                        }
                      ]}
                      onPress={handleToggleFilter}
                    >
                      <Ionicons
                        name="filter"
                        size={20}
                        color={theme.text}
                      />
                    </Pressable>

                    <Pressable
                      style={[styles.addButton, { backgroundColor: theme.primary }]}
                      onPress={() => setAddLeadModalVisible(true)}
                    >
                      <Ionicons name="add" size={24} color="#FFFFFF" />
                    </Pressable>
                  </>
                )}
              </View>

              <Animated.View style={[
                styles.countContainer,
                {
                  height: (scrollY as any).interpolate({
                    inputRange: [0, 50],
                    outputRange: [72, 0],
                    extrapolate: 'clamp'
                  }),
                  opacity: (scrollY as any).interpolate({
                    inputRange: [0, 30],
                    outputRange: [1, 0],
                    extrapolate: 'clamp'
                  }),
                  overflow: 'hidden',
                  marginTop: (scrollY as any).interpolate({
                    inputRange: [0, 50],
                    outputRange: [4, 0],
                    extrapolate: 'clamp'
                  }),
                  marginBottom: (scrollY as any).interpolate({
                    inputRange: [0, 50],
                    outputRange: [4, 0],
                    extrapolate: 'clamp'
                  }),
                }
              ]}>
                <View style={styles.stageSwitcher}>
                  <Pressable onPress={handlePrevStage} style={styles.switcherArrow}>
                    <Ionicons name="chevron-back" size={20} color={theme.primary} />
                  </Pressable>
                  <Text style={[styles.stageSwitcherText, { color: theme.text }]}>
                    {currentStageLabel}
                  </Text>
                  <Pressable onPress={handleNextStage} style={styles.switcherArrow}>
                    <Ionicons name="chevron-forward" size={20} color={theme.primary} />
                  </Pressable>
                </View>

                <View style={styles.pipelineInfoRow}>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                  <Text style={[styles.pipelineInfoText, { color: theme.textSecondary }]} numberOfLines={1}>
                    {currentPipelineName} — {getLeadsFoundLabel(leadCount)}
                  </Text>
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                </View>
              </Animated.View>
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
        </Animated.ScrollView>
      </View>

      {/* Stage Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, paddingTop: useSafeAreaInsets().top, backgroundColor: theme.background }}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            {filterModalStep === 'stage' ? (
              <Pressable onPress={handleBackToPipelines} style={styles.modalBackButton}>
                <Ionicons name="chevron-back" size={24} color={theme.primary} />
              </Pressable>
            ) : (
              <View style={styles.modalBackButton} /> // Spacer
            )}

            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {filterModalStep === 'pipeline' ? 'Select pipeline' : 'Select stage'}
            </Text>

            <Pressable onPress={closeModal} style={styles.modalCloseButton}>
              <Ionicons name="close" size={24} color={theme.primary} />
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            {filterModalStep === 'pipeline' ? (
              <FlatList
                data={pipelinesData?.data || []}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ padding: 16 }}
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
                        <Text style={[styles.modalItemText, { color: theme.text }]}>
                          {pipelineName}
                        </Text>
                        {stagesCount > 0 && (
                          <Text style={[styles.modalItemSubtext, { color: theme.textSecondary }]}>
                            {stagesCount} стадій
                          </Text>
                        )}
                      </View>
                      {selectedPipeline === item.id && (
                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                      )}
                    </Pressable>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.modalEmptyContainer}>
                    <Ionicons name="list-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.modalEmptyText, { color: theme.textSecondary }]}>
                      Немає доступних воронок
                    </Text>
                  </View>
                }
              />
            ) : (
              <FlatList
                data={LEAD_STAGES}
                keyExtractor={(item, idx) => `${item.id}-${idx}`}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => {
                  const itemLabel = String(item.label || '');
                  const itemValue = String(item.value || item.label || '');
                  const isActive = selectedStageId === item.id || (selectedStage === itemValue && !selectedStageId);

                  return (
                    <Pressable
                      style={[
                        styles.modalItem,
                        { borderBottomColor: theme.border },
                        isActive && { backgroundColor: theme.card },
                      ]}
                      onPress={() => handleSelectStage(itemValue, item.id)}
                    >
                      <View style={styles.modalItemContent}>
                        <View style={[styles.stageColorIndicator, { backgroundColor: item.color }]} />
                        <Text style={[styles.modalItemText, { color: theme.text }]}>
                          {itemLabel}
                        </Text>
                      </View>
                      {isActive && (
                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </View>
        </View>
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

      {/* Floating Pipeline Switcher */}
      {/* Floating Pipeline Switcher */}
      <View style={styles.floatingPipelineContainer} pointerEvents="box-none">
        {/* Left Gradient */}
        <LinearGradient
          colors={[theme.background, theme.background + '00']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.floatingGradientLeft}
          pointerEvents="none"
        />

        {/* Content with PanResponder */}
        <Animated.View
          style={[
            styles.pipelineSwitcherContent,
            { transform: [{ translateX: pipelineTranslateX }] }
          ]}
          {...pipelinePanResponder.panHandlers}
        >
          {/* Prev Pipeline (Left) */}
          {prevPipeline && (
            <View style={[styles.pipelinePillSide, { opacity: 0.5 }]}>
              <Text style={[styles.pipelinePillTextSide, { color: theme.textSecondary }]} numberOfLines={1}>
                {prevPipeline.name}
              </Text>
            </View>
          )}

          {/* Current Pipeline (Center) */}
          <View style={[styles.pipelinePill, { backgroundColor: theme.primary, borderColor: theme.border }]}>
            <Text style={styles.pipelinePillText} numberOfLines={1}>
              {currentPipelineName}
            </Text>
          </View>

          {/* Next Pipeline (Right) */}
          {nextPipeline && (
            <View style={[styles.pipelinePillSide, { opacity: 0.5 }]}>
              <Text style={[styles.pipelinePillTextSide, { color: theme.textSecondary }]} numberOfLines={1}>
                {nextPipeline.name}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Right Gradient */}
        <LinearGradient
          colors={[theme.background + '00', theme.background]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.floatingGradientRight}
          pointerEvents="none"
        />
      </View>

    </SafeAreaView>
  );
}

// Separate component for scrub segments to use Reanimated styles efficiently
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedSection: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
    alignItems: 'center',
    height: 44,
  },
  searchBarContainer: {
    flex: 1,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  stageSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
  },
  switcherArrow: {
    padding: 8,
  },
  stageSwitcherText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 120,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  pipelineInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  pipelineInfoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  leadCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
  },
  leadRowMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leadAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  leadInfo: {
    flex: 1,
    gap: 2,
  },
  leadNameNew: {
    fontSize: 14,
    fontWeight: '600',
  },
  leadDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leadPriceNew: {
    fontSize: 13,
    fontWeight: '500',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalContentTall: {
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12, // More compact like KB header
    borderBottomWidth: 0.5,
  },
  modalBackButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16, // Better spacing
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  modalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  modalItemText: {
    fontWeight: '500',
    fontSize: 15,
  },
  modalItemSubtext: {
    fontSize: 13,
    marginLeft: 'auto',
    marginRight: 8,
  },
  stageColorIndicator: {
    width: 24, // Bigger square
    height: 24,
    borderRadius: 6, // Rounded square
  },
  modalEmptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalEmptyText: {
    marginTop: 12,
    fontSize: 14,
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
  scrubWrapper: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  scrubIndicatorWrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 60,
    alignItems: 'center',
  },
  scrubIndicator: {
    alignItems: 'center',
    width: 200, // Fixed width for easier centering calculation
  },
  scrubTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  stageBadgePoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  scrubTooltipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrubBarContainer: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrubBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 2,
  },
  scrubSegment: {
    flex: 1,
    borderRadius: 3,
  },
  pipelineSwitcher: {
    marginBottom: 12,
    width: '100%',
  },
  pipelineSwitcherInner: {
    paddingHorizontal: 4,
    gap: 8,
  },
  pipelineTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pipelineTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  floatingPipelineContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  floatingGradientLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 60,
    zIndex: 20,
  },
  floatingGradientRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 60,
    zIndex: 20,
  },
  pipelineSwitcherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingHorizontal: 20,
  },
  pipelinePillWrapper: {
    paddingHorizontal: 4,
  },
  pipelinePill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  pipelinePillSide: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(128,128,128, 0.08)',
    transform: [{ scale: 0.85 }],
    maxWidth: 90,
  },
  pipelinePillText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  pipelinePillTextSide: {
    fontWeight: '500',
    fontSize: 11,
  },
});
