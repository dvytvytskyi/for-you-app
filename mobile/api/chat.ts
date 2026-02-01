import { backendApiClient } from './backend-client';
import { ChatMessage, SendMessageDto } from '@/types/chat';

export const chatApi = {
    /**
     * Отримати історію повідомлень
     */
    async getMessages(): Promise<ChatMessage[]> {
        const response = await backendApiClient.get('/chat');
        // Відповідь може бути обгорнута в { success, data } або бути прямим масивом
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    /**
     * Відправити повідомлення
     */
    async sendMessage(data: SendMessageDto): Promise<ChatMessage> {
        const formData = new FormData();

        if (data.content) formData.append('content', data.content);
        formData.append('type', data.type);

        if (data.propertyId) formData.append('propertyId', data.propertyId);

        if (data.file) {
            // data.file повинен бути об'єктом { uri, name, type } для React Native
            formData.append('file', data.file);
        }

        const response = await backendApiClient.post('/chat', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.success && response.data.data) {
            return response.data.data;
        }
        return response.data;
    },

    /**
     * Видалити повідомлення
     */
    async deleteMessage(messageId: string): Promise<boolean> {
        const response = await backendApiClient.delete(`/chat/${messageId}`);
        return response.data && response.data.success;
    },
};
