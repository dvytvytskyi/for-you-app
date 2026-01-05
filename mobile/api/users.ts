import { backendApiClient } from './backend-client';

export interface UserCountResponse {
    success: boolean;
    message: string;
    data: {
        count: number;
    };
}

export const usersApi = {
    /**
     * Отримати кількість за роллю (наприклад, INVESTOR)
     */
    async getInvestorsCount(): Promise<number> {
        try {
            // Бекенд реалізував ендпоїнт: /api/v1/users/counts/investors
            const response = await backendApiClient.get<UserCountResponse>('/users/counts/investors');

            if (response.data && response.data.success && response.data.data) {
                return response.data.data.count;
            }

            return 0;
        } catch (error) {
            console.error('Error fetching investors count:', error);
            return 0;
        }
    },

    /**
     * Завантажити аватар та оновити профіль
     */
    async uploadAvatar(uri: string): Promise<string> {
        const formData = new FormData();
        const filename = uri.split('/').pop() || 'avatar.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('file', {
            uri: uri,
            name: filename,
            type: type,
        } as any);

        const response = await backendApiClient.post('/upload/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data?.success && response.data?.data?.url) {
            return response.data.data.url;
        }

        throw new Error(response.data?.message || 'Failed to upload avatar');
    }
};
