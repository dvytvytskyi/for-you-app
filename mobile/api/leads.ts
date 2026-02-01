import { apiClient } from './client';

export interface Lead {
  id: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  status: 'NEW' | 'IN_PROGRESS' | 'CLOSED';
  statusName?: string; // Human readable stage name
  price?: number;
  amoLeadId?: number;
  pipelineId?: number;
  stageId?: number;
  responsibleUserId?: number;
  createdAt: string;
  updatedAt: string;

  // Raw AmoCRM Data
  customFields?: {
    field_id: number;
    field_name: string;
    field_code: string;
    values: { value: string }[];
  }[];

  embedded?: {
    contacts?: {
      id: number;
      name: string;
      custom_fields_values?: any[];
    }[];
    tags?: any[];
  };
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

export interface Note {
  id: number;
  entity_id: number;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  text: string;
  note_type: string;
  params?: any;
}

export interface Event {
  id: string;
  type: string;
  entity_id: number;
  created_by: number;
  created_at: number;
  value_after?: any;
  value_before?: any;
}

export interface LeadDetails {
  lead: Lead;
  notes: Note[];
  events: Event[];
}

export const leadsApi = {
  async getAll(filters?: LeadFilters): Promise<LeadsResponse> {
    const response = await apiClient.get<LeadsResponse | any>('/leads', {
      params: filters,
    });

    const result = response.data;

    // Handing possible double wrapping { success, data: { data, total ... } }
    if (result && result.success === true && result.data && result.data.data) {
      return result.data;
    }

    return result;
  },

  async getById(id: string): Promise<LeadDetails> {
    console.log(`[API] Fetching lead by ID: ${id}`);
    // Switch to the new live AmoCRM endpoint
    try {
      const response = await apiClient.get<any>(`/amo-crm/leads/${id}`);
      console.log(`[API] getById response status:`, response.status);

      const data = response.data;
      // Handle { success: true, data: { ... } } pattern
      if (data?.success && data?.data) {
        return data.data;
      }

      // Handle direct return { lead: ..., notes: ... }
      if (data?.lead) {
        return data;
      }

      return data?.data || data;
    } catch (error: any) {
      console.error(`[API] Error fetching lead ${id}:`, error);
      throw error;
    }
  },

  async create(data: any): Promise<Lead> {
    const response = await apiClient.post<any>('/leads', data);
    return response.data?.data || response.data;
  },
};

