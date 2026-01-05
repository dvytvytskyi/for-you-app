import { apiClient } from './client';
import * as SecureStore from 'expo-secure-store';

export interface AmoPipeline {
  id: number;
  name: string;
  stages: AmoStage[];
  sort?: number;
  isMain?: boolean;
}

export interface AmoStage {
  id: number;
  pipelineId: number;
  name: string;
  sort: number;
  isEditable?: boolean;
  color?: string;
  type?: number; // Тип стадії з AMO CRM
  mappedStatus?: 'NEW' | 'IN_PROGRESS' | 'CLOSED' | null;
}

export interface PipelinesResponse {
  success: boolean;
  data: AmoPipeline[];
}

export interface StagesResponse {
  success: boolean;
  data: AmoStage[];
}

export interface AmoCrmConnectionStatus {
  connected: boolean;
  hasTokens: boolean;
  domain: string;
  accountId: string;
}

/**
 * Генерує випадковий state для OAuth безпеки
 */
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Побудувати OAuth URL для AMO CRM
 * Використовуємо стандартний OAuth2 authorize endpoint
 */
export async function buildAmoAuthUrl(): Promise<string> {
  // Отримати user_id з токену
  const token = await SecureStore.getItemAsync('accessToken');
  let userId: string | undefined;

  if (token) {
    try {
      // Декодувати JWT токен (без перевірки підпису, тільки для отримання userId)
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      userId = payload.userId || payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  const stateData = {
    random: generateState(),
    userId: userId || 'unknown',
    source: 'mobile',
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

  // Зберігаємо state для перевірки пізніше
  try {
    await SecureStore.setItemAsync('amo_crm_oauth_state', state);
  } catch (error) {
    console.error('Error saving OAuth state:', error);
  }

  // Використовуємо стандартний OAuth endpoint від AMO CRM
  // Redirect URI має бути зареєстрований в налаштуваннях інтеграції AMO CRM
  // Не передаємо redirect_uri в URL - він береться з налаштувань інтеграції
  const params = new URLSearchParams({
    client_id: '2912780f-a1e4-4d5d-a069-ee01422d8bef',
    state,
    mode: 'popup', // popup закривається після авторизації
  });

  // Правильний формат згідно з документацією AMO CRM
  return `https://www.amocrm.ru/oauth?${params.toString()}`;
}

export const amoCrmApi = {
  async getConnectionStatus(): Promise<AmoCrmConnectionStatus> {
    const response = await apiClient.get<any>('/amo-crm/status');
    return response.data.data;
  },

  async exchangeCode(code: string): Promise<void> {
    await apiClient.post('/amo-crm/exchange-code', { code });
  },

  async disconnect(): Promise<void> {
    await apiClient.post('/amo-crm/disconnect');
  },

  async getPipelines(): Promise<PipelinesResponse> {
    const response = await apiClient.get<PipelinesResponse>('/amo-crm/pipelines');
    return response.data;
  },

  async getStages(pipelineId: number): Promise<StagesResponse> {
    const response = await apiClient.get<StagesResponse>(`/amo-crm/pipelines/${pipelineId}/stages`);
    return response.data;
  },
};

