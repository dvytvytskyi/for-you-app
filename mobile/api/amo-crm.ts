import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export interface AmoPipeline {
  id: number;
  name: string;
  sort: number;
  isMain: boolean;
  isUnsortedOn: boolean;
  stages?: AmoStage[];
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
  data: AmoPipeline[];
  count: number;
}

export interface StagesResponse {
  data: AmoStage[];
  count: number;
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
  
  // Створити state з user_id
  const stateData = {
    random: generateState(),
    userId: userId || 'unknown',
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
  /**
   * Перевірити статус підключення AMO CRM для поточного користувача
   * Endpoint: GET /api/amo-crm/status (на admin-panel-backend)
   */
  async getConnectionStatus(): Promise<AmoCrmConnectionStatus> {
    // Використовуємо admin-panel-backend напряму (не через main backend)
    // Тому використовуємо повний URL
    const response = await axios.get<{ success: boolean; data: AmoCrmConnectionStatus }>(
      'https://admin.foryou-realestate.com/api/amo-crm/status',
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync('accessToken')}`,
        },
      },
    );
    return response.data.data;
  },

  /**
   * Обміняти authorization code на токени
   * Endpoint: POST /api/amo-crm/exchange-code (на admin-panel-backend)
   */
  async exchangeCode(code: string): Promise<void> {
    await axios.post(
      'https://admin.foryou-realestate.com/api/amo-crm/exchange-code',
      { code },
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync('accessToken')}`,
          'Content-Type': 'application/json',
        },
      },
    );
  },

  /**
   * Відключити AMO CRM
   * Endpoint: POST /api/amo-crm/disconnect (на admin-panel-backend)
   */
  async disconnect(): Promise<void> {
    await axios.post(
      'https://admin.foryou-realestate.com/api/amo-crm/disconnect',
      {},
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync('accessToken')}`,
        },
      },
    );
  },

  /**
   * Отримати список воронок (pipelines)
   * Endpoint: GET /api/amo-crm/pipelines (на admin-panel-backend)
   */
  async getPipelines(): Promise<PipelinesResponse> {
    const response = await axios.get<PipelinesResponse>(
      'https://admin.foryou-realestate.com/api/amo-crm/pipelines',
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync('accessToken')}`,
        },
      },
    );
    return response.data;
  },

  /**
   * Отримати stages конкретної воронки
   * Endpoint: GET /api/amo-crm/pipelines/:id/stages (на admin-panel-backend)
   */
  async getStages(pipelineId: number): Promise<StagesResponse> {
    const response = await axios.get<StagesResponse>(
      `https://admin.foryou-realestate.com/api/amo-crm/pipelines/${pipelineId}/stages`,
      {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync('accessToken')}`,
        },
      },
    );
    return response.data;
  },
};

