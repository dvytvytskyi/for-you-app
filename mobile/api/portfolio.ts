import { backendApiClient } from './backend-client';
import { PortfolioResponse } from '@/types/portfolio';

export const portfolioApi = {
    /**
     * Отримати портфоліо користувача з усією аналітикою
     */
    async getPortfolio(userId: string): Promise<PortfolioResponse> {
        const response = await backendApiClient.get(`/portfolio/${userId}`);
        if (response.data && response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data?.message || 'Failed to fetch portfolio');
    },

    /**
     * Отримати тимчасове посилання на завантаження документа
     */
    async getDocumentDownloadUrl(documentId: string): Promise<string> {
        const response = await backendApiClient.get(`/documents/${documentId}/download-url`);
        if (response.data && response.data.success && response.data.data?.url) {
            return response.data.data.url;
        }
        throw new Error(response.data?.message || 'Failed to get download URL');
    },

    /**
     * Отримати URL для генерації PDF портфоліо
     */
    getPortfolioPdfUrl(portfolioItemId: string): string {
        const baseUrl = backendApiClient.defaults.baseURL;
        return `${baseUrl}/portfolio/${portfolioItemId}/pdf`;
    }
};
