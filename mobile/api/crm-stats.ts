import { apiClient } from './client';

export interface CrmStats {
  newLeads: number; // Leads зі статусом NEW
  totalLeads: number; // Усього лідів
  activeDeals: number; // Leads зі статусом IN_PROGRESS
  totalAmount: number; // Сума price всіх leads
}

export const crmStatsApi = {
  /**
   * Отримати статистику CRM для поточного користувача (брокера)
   * Endpoint: GET /api/v1/analytics/my-stats (на admin-panel-backend)
   * Якщо endpoint не існує, розраховуємо на клієнті через leads API
   */
  async getMyStats(): Promise<CrmStats> {
    // Ми використовуємо клієнтський розрахунок, щоб гарантувати правильну логіку:
    // 1. New Leads = створені сьогодні (local time)
    // 2. Total Amount = сума всіх лідів (без прив'язки до статусу)
    // Це надійніше, ніж залежати від логіки бекенду, яка може відрізнятися.
    console.log('🔄 Calculating stats client-side to ensure "Today" logic...');
    return this.calculateStatsFromLeads();

    /* Backend implementation skipped to enforce custom logic
    try {
      const response = await apiClient.get<CrmStats>('/analytics/my-stats');
      ...
    } catch (error: any) { ... }
    */
  },

  /**
   * Розрахувати статистику з leads (fallback метод)
   */
  async calculateStatsFromLeads(): Promise<CrmStats> {
    const { leadsApi } = await import('./leads');

    // Отримуємо всі leads
    const allLeads = await leadsApi.getAll({ limit: 1000 });

    // New Leads: створені сьогодні (поточна дата по MSK/Local time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('📅 Debug Dates - Today (Local Midnight):', today.toString());

    if (allLeads?.data?.length > 0) {
      const firstLead = allLeads.data[0];
      console.log('📅 Debug Dates - First Lead Raw:', firstLead.createdAt);
      console.log('📅 Debug Dates - First Lead Parsed:', new Date(firstLead.createdAt).toString());
    }

    const newLeads = allLeads.data.filter(lead => {
      if (!lead.createdAt) return false;
      const leadDate = new Date(lead.createdAt);
      leadDate.setHours(0, 0, 0, 0);

      // Compare year, month, day manually to avoid potential timezone offset shifts at midnight boundaries
      const isSameDay = leadDate.getFullYear() === today.getFullYear() &&
        leadDate.getMonth() === today.getMonth() &&
        leadDate.getDate() === today.getDate();

      return isSameDay;
    }).length;

    const activeDeals = allLeads.data.filter(lead => lead.status === 'IN_PROGRESS').length;
    const totalLeads = allLeads.data.length;

    // Розраховуємо total amount (сума price всіх leads)
    const totalAmount = allLeads.data
      .reduce((sum, lead) => {
        const price = parseFloat(String(lead.price || 0));
        return sum + (isNaN(price) ? 0 : price);
      }, 0);

    return {
      newLeads,
      totalLeads,
      activeDeals,
      totalAmount,
    };
  },
};
