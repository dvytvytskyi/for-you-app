import { backendApiClient } from './backend-client';

export interface Lead {
  id: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
  price?: number;
  amoLeadId?: number;
  responsibleUserId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
  pipelineId?: number; // ID pipeline з AMO CRM
  stageId?: number; // ID стадії з AMO CRM
  brokerId?: string;
  clientId?: string;
  propertyId?: string;
}

export interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const leadsApi = {
  /**
   * Отримати список leads
   * Endpoint: GET /api/v1/leads (на admin-panel-backend)
   */
  async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
    // Очищаємо undefined значення, щоб не передавати їх в query параметрах
    const cleanFilters: Record<string, any> = {};
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key as keyof LeadFilters];
        if (value !== undefined && value !== null) {
          cleanFilters[key] = value;
        }
      });
    }
    
    // Формуємо повний URL для логування
    const queryString = new URLSearchParams(cleanFilters as any).toString();
    const fullUrl = `${backendApiClient.defaults.baseURL}/leads${queryString ? `?${queryString}` : ''}`;
    
    console.log('📤 Leads API Request:', {
      url: '/leads',
      method: 'GET',
      filters: cleanFilters,
      cleanFiltersKeys: Object.keys(cleanFilters),
      limit: cleanFilters.limit,
      page: cleanFilters.page,
      pipelineId: cleanFilters.pipelineId,
      stageId: cleanFilters.stageId,
      status: cleanFilters.status,
      fullUrl: fullUrl,
    });
    
    const response = await backendApiClient.get<any>('/leads', {
      params: cleanFilters,
    });
    
    console.log('📥 Leads API Response:', {
      status: response.status,
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      dataLength: response.data?.data?.length || 0,
      total: response.data?.total || 0,
      page: response.data?.page || 0,
      limit: response.data?.limit || 0,
      totalPages: response.data?.totalPages || 0,
      hasSuccess: 'success' in (response.data || {}),
      requestUrl: response.config?.url,
      requestParams: response.config?.params,
      fullResponse: JSON.stringify(response.data, null, 2).substring(0, 1000), // Перші 1000 символів
    });
    
    // Попередження, якщо повертається менше лідів, ніж очікувалось
    if (cleanFilters.limit && response.data?.data?.length < cleanFilters.limit && response.data?.total > response.data?.data?.length) {
      console.warn('⚠️ Повернуто менше лідів, ніж запитувалось:', {
        requestedLimit: cleanFilters.limit,
        received: response.data?.data?.length || 0,
        total: response.data?.total || 0,
        page: response.data?.page || 0,
        totalPages: response.data?.totalPages || 0,
      });
    }
    
    // Детальне логування структури відповіді
    if (response.data) {
      console.log('📋 Response structure:', {
        isArray: Array.isArray(response.data),
        hasDataKey: 'data' in response.data,
        hasTotalKey: 'total' in response.data,
        dataType: typeof response.data,
        dataIsArray: Array.isArray(response.data.data),
        dataLength: response.data.data?.length || 0,
        total: response.data.total,
      });
    }
    
    // Перевірка, чи відповідь має формат { success: false, ... }
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success === false) {
        throw new Error(response.data.message || response.data.error || 'Failed to fetch leads');
      }
      // Якщо success: true, але дані в response.data.data
      if (response.data.success === true && response.data.data) {
        return response.data.data;
      }
    }
    
    // Звичайний формат { data: [...], total, ... }
    return response.data;
  },

  /**
   * Отримати деталі lead
   * Endpoint: GET /api/v1/leads/:id (на admin-panel-backend)
   */
  async getById(id: string): Promise<Lead> {
    const response = await backendApiClient.get<Lead>(`/leads/${id}`);
    return response.data;
  },

  /**
   * Створити новий lead
   * Endpoint: POST /api/v1/leads (на admin-panel-backend)
   */
  async create(data: {
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    price?: number;
    pipelineId?: number;
    stageId?: number;
    comment?: string;
  }): Promise<Lead> {
    const response = await backendApiClient.post<Lead>('/leads', data);
    return response.data;
  },
};

