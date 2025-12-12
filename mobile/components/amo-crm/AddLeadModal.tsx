import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme';
import { amoCrmApi, type AmoPipeline, type AmoStage } from '@/api/amo-crm';
import { leadsApi } from '@/api/leads';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AddLeadModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  amoConnected?: boolean;
}

export function AddLeadModal({ visible, onClose, onSuccess, amoConnected = false }: AddLeadModalProps) {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'pipeline' | 'stage' | 'form'>(amoConnected ? 'pipeline' : 'form');
  const [selectedPipeline, setSelectedPipeline] = useState<AmoPipeline | null>(null);
  const [selectedStage, setSelectedStage] = useState<AmoStage | null>(null);
  const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    price: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Завантаження pipelines (тільки якщо AMO CRM підключено)
  // ⚠️ ВАЖЛИВО: Stages вже включені в відповідь /api/amo-crm/pipelines, не потрібно робити окремі запити!
  const { data: pipelinesData, isLoading: pipelinesLoading, error: pipelinesError } = useQuery({
    queryKey: ['amo-pipelines'],
    queryFn: async () => {
      try {
        console.log('🔄 [AddLeadModal] Завантаження pipelines (з stages)...');
        const pipelines = await amoCrmApi.getPipelines();
        console.log('✅ [AddLeadModal] Pipelines завантажено:', pipelines.data.length);
        
        // Stages вже включені в відповідь, просто перевіряємо та логуємо
        pipelines.data.forEach((pipeline) => {
          const stagesCount = pipeline.stages?.length || 0;
          console.log(`📊 [AddLeadModal] Pipeline ${pipeline.id} (${pipeline.name}): ${stagesCount} stages`);
        });
        
        const totalStages = pipelines.data.reduce((sum, p) => sum + (p.stages?.length || 0), 0);
        console.log(`✅ [AddLeadModal] Всього stages завантажено: ${totalStages}`);
        
        return pipelines;
      } catch (error: any) {
        console.error('❌ [AddLeadModal] Error loading pipelines:', error);
        console.error('📋 [AddLeadModal] Error details:', {
          status: error?.response?.status,
          message: error?.message,
          data: error?.response?.data,
        });
        throw error;
      }
    },
    enabled: visible && amoConnected, // Завантажуємо тільки коли модалка відкрита та AMO підключено
    retry: 1,
    retryDelay: 2000,
  });

  // Скидання стану при закритті
  useEffect(() => {
    if (!visible) {
      setStep(amoConnected ? 'pipeline' : 'form');
      setSelectedPipeline(null);
      setSelectedStage(null);
      setFormData({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        price: '',
        comment: '',
      });
    }
  }, [visible, amoConnected]);

  const handlePipelineSelect = (pipeline: AmoPipeline) => {
    setSelectedPipeline(pipeline);
    if (pipeline.stages && pipeline.stages.length > 0) {
      setStep('stage');
    } else {
      // Якщо немає stages, переходимо до форми
      setStep('form');
    }
  };

  const handleStageSelect = (stage: AmoStage) => {
    setSelectedStage(stage);
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') {
      if (selectedStage) {
        setStep('stage');
        setSelectedStage(null);
      } else {
        setStep('pipeline');
        setSelectedPipeline(null);
      }
    } else if (step === 'stage') {
      setStep('pipeline');
      setSelectedPipeline(null);
    }
  };

  const handleSubmit = async () => {
    // Валідація
    if (!formData.guestName.trim() && !formData.guestPhone.trim() && !formData.guestEmail.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть хоча б ім\'я, телефон або email');
      return;
    }

    setIsSubmitting(true);
    try {
      await leadsApi.create({
        guestName: formData.guestName.trim() || undefined,
        guestPhone: formData.guestPhone.trim() || undefined,
        guestEmail: formData.guestEmail.trim() || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        pipelineId: selectedPipeline?.id,
        stageId: selectedStage?.id,
        comment: formData.comment.trim() || undefined,
      });

      // Оновити список leads
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
      
      Alert.alert('Успіх', 'Lead успішно створено', [
        {
          text: 'OK',
          onPress: () => {
            onSuccess?.();
            onClose();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error creating lead:', error);
      Alert.alert(
        'Помилка',
        error?.response?.data?.message || error?.message || 'Не вдалося створити lead'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const pipelines = pipelinesData?.data || [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            {step !== 'pipeline' && (
              <Pressable onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
              </Pressable>
            )}
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {step === 'pipeline' && 'Виберіть воронку'}
              {step === 'stage' && 'Виберіть стадію'}
              {step === 'form' && 'Новий lead'}
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {step === 'pipeline' && (
              <View style={styles.pipelineList}>
                {pipelinesLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                      Завантаження воронок...
                    </Text>
                  </View>
                ) : pipelinesError ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
                    <Text style={[styles.emptyText, { color: theme.text }]}>
                      Помилка завантаження воронок
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                      {(pipelinesError as any)?.response?.data?.message || (pipelinesError as any)?.message || 'Спробуйте пізніше'}
                    </Text>
                  </View>
                ) : pipelines.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="folder-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      Немає доступних воронок
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                      Підключіть AMO CRM для вибору воронок
                    </Text>
                  </View>
                ) : (
                  pipelines.map((pipeline) => (
                    <Pressable
                      key={pipeline.id}
                      style={[
                        styles.pipelineItem,
                        { backgroundColor: theme.card, borderColor: theme.border },
                        selectedPipeline?.id === pipeline.id && {
                          borderColor: theme.primary,
                          borderWidth: 2,
                        },
                      ]}
                      onPress={() => handlePipelineSelect(pipeline)}
                    >
                      <View style={styles.pipelineInfo}>
                        <Text style={[styles.pipelineName, { color: theme.text }]}>
                          {pipeline.name || 'Без назви'}
                        </Text>
                        {pipeline.isMain && (
                          <View style={[styles.mainBadge, { backgroundColor: theme.primary }]}>
                            <Text style={styles.mainBadgeText}>Основна</Text>
                          </View>
                        )}
                      </View>
                      {pipeline.stages && pipeline.stages.length > 0 ? (
                        <Text style={[styles.pipelineStages, { color: theme.textSecondary }]}>
                          {pipeline.stages.length} стадій
                        </Text>
                      ) : (
                        <Text style={[styles.pipelineStages, { color: theme.textSecondary, fontStyle: 'italic' }]}>
                          Немає стадій
                        </Text>
                      )}
                      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </Pressable>
                  ))
                )}
              </View>
            )}

            {step === 'stage' && selectedPipeline && (
              <View style={styles.stageList}>
                {selectedPipeline.stages && selectedPipeline.stages.length > 0 ? (
                  selectedPipeline.stages.map((stage) => (
                    <Pressable
                      key={stage.id}
                      style={[
                        styles.stageItem,
                        { backgroundColor: theme.card, borderColor: theme.border },
                        selectedStage?.id === stage.id && {
                          borderColor: stage.color || theme.primary,
                          borderWidth: 2,
                        },
                      ]}
                      onPress={() => handleStageSelect(stage)}
                    >
                      <View
                        style={[
                          styles.stageColorIndicator,
                          { backgroundColor: stage.color || theme.primary },
                        ]}
                      />
                      <Text style={[styles.stageName, { color: theme.text }]}>
                        {stage.name}
                      </Text>
                      {selectedStage?.id === stage.id && (
                        <Ionicons name="checkmark" size={20} color={stage.color || theme.primary} />
                      )}
                    </Pressable>
                  ))
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="list-outline" size={48} color={theme.textSecondary} />
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                      Немає доступних стадій
                    </Text>
                  </View>
                )}
              </View>
            )}

            {step === 'form' && (
              <View style={styles.form}>
                <View style={styles.formSection}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>
                    Ім'я <Text style={{ color: theme.textSecondary }}>(опціонально)</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="Введіть ім'я"
                    placeholderTextColor={theme.textSecondary}
                    value={formData.guestName}
                    onChangeText={(text) => setFormData({ ...formData, guestName: text })}
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>
                    Телефон <Text style={{ color: theme.textSecondary }}>(опціонально)</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="+380501234567"
                    placeholderTextColor={theme.textSecondary}
                    value={formData.guestPhone}
                    onChangeText={(text) => setFormData({ ...formData, guestPhone: text })}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>
                    Email <Text style={{ color: theme.textSecondary }}>(опціонально)</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="email@example.com"
                    placeholderTextColor={theme.textSecondary}
                    value={formData.guestEmail}
                    onChangeText={(text) => setFormData({ ...formData, guestEmail: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>
                    Ціна <Text style={{ color: theme.textSecondary }}>(опціонально)</Text>
                  </Text>
                  <TextInput
                    style={[styles.formInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                    placeholder="0"
                    placeholderTextColor={theme.textSecondary}
                    value={formData.price}
                    onChangeText={(text) => setFormData({ ...formData, price: text.replace(/[^0-9.]/g, '') })}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formSection}>
                  <Text style={[styles.formLabel, { color: theme.text }]}>
                    Коментар <Text style={{ color: theme.textSecondary }}>(опціонально)</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      styles.formTextArea,
                      { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
                    ]}
                    placeholder="Додаткові нотатки..."
                    placeholderTextColor={theme.textSecondary}
                    value={formData.comment}
                    onChangeText={(text) => setFormData({ ...formData, comment: text })}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Selected Pipeline & Stage Info */}
                {(selectedPipeline || selectedStage) && (
                  <View style={[styles.selectedInfo, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    {selectedPipeline && (
                      <View style={styles.selectedInfoRow}>
                        <Ionicons name="folder" size={16} color={theme.textSecondary} />
                        <Text style={[styles.selectedInfoText, { color: theme.textSecondary }]}>
                          Воронка: {selectedPipeline.name}
                        </Text>
                      </View>
                    )}
                    {selectedStage && (
                      <View style={styles.selectedInfoRow}>
                        <View
                          style={[
                            styles.stageColorIndicator,
                            styles.selectedInfoIndicator,
                            { backgroundColor: selectedStage.color || theme.primary },
                          ]}
                        />
                        <Text style={[styles.selectedInfoText, { color: theme.textSecondary }]}>
                          Стадія: {selectedStage.name}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          {step === 'form' && (
            <View style={[styles.footer, { borderTopColor: theme.border }]}>
              <Pressable
                style={[styles.cancelButton, { borderColor: theme.border }]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={[styles.cancelButtonText, { color: theme.text }]}>Скасувати</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.submitButton,
                  { backgroundColor: theme.primary },
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Створити</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
  },
  pipelineList: {
    gap: 12,
  },
  pipelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  pipelineInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pipelineName: {
    fontSize: 16,
    fontWeight: '500',
  },
  mainBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  pipelineStages: {
    fontSize: 14,
  },
  stageList: {
    gap: 12,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  stageColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stageName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 16,
  },
  formSection: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  formInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  formTextArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  selectedInfo: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginTop: 8,
  },
  selectedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedInfoIndicator: {
    width: 8,
    height: 8,
  },
  selectedInfoText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
