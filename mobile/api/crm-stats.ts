import { backendApiClient } from './backend-client';

export interface CrmStats {
  newLeads: number; // Leads зі статусом NEW
  activeDeals: number; // Leads зі статусом IN_PROGRESS
  totalAmount: number; // Сума price всіх IN_PROGRESS + CLOSED leads
}

export const crmStatsApi = {
  /**
   * Отримати статистику CRM для поточного користувача (брокера)
   * Endpoint: GET /api/v1/analytics/my-stats (на admin-panel-backend)
   * Якщо endpoint не існує, розраховуємо на клієнті через leads API
   */
  async getMyStats(): Promise<CrmStats> {
    try {
      const response = await backendApiClient.get<CrmStats>('/analytics/my-stats');
      return response.data;
    } catch (error: any) {
      // Якщо endpoint не існує, розрахуємо на клієнті через leads API
      if (error?.response?.status === 404) {
        console.log('⚠️ Analytics endpoint not found, calculating stats from leads...');
        return this.calculateStatsFromLeads();
      }
      throw error;
    }
  },

  /**
   * Розрахувати статистику з leads (fallback метод)
   */
  async calculateStatsFromLeads(): Promise<CrmStats> {
    const { leadsApi } = await import('./leads');
    
    // Отримуємо всі leads
    const allLeads = await leadsApi.getAll({ limit: 1000 });
    
    const newLeads = allLeads.data.filter(lead => lead.status === 'NEW').length;
    const activeDeals = allLeads.data.filter(lead => lead.status === 'IN_PROGRESS').length;
    
    // Розраховуємо total amount (сума price всіх IN_PROGRESS + CLOSED)
    const totalAmount = allLeads.data
      .filter(lead => lead.status === 'IN_PROGRESS' || lead.status === 'CLOSED')
      .reduce((sum, lead) => sum + (lead.price || 0), 0);
    
    return {
      newLeads,
      activeDeals,
      totalAmount,
    };
  },
};
