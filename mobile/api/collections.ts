import { apiClient } from './client';
import { Property } from './properties';

export interface Collection {
    id: string;
    title: string;
    description?: string;
    image?: string;
    userId: string;
    properties: Property[];
    createdAt: string;
    updatedAt: string;
}

export const collectionsApi = {
    getAll: async () => {
        const response = await apiClient.get<any>('/collections');
        const result = response.data;

        // Robust unwrapping for various API response formats
        if (result?.success && result?.data) {
            return Array.isArray(result.data) ? result.data : (result.data.data || result.data);
        }

        return Array.isArray(result) ? result : (result?.data || []);
    },
    create: async (data: { title: string; description?: string; image?: string }) => {
        const payload: any = {
            title: data.title,
            name: data.title,
            description: data.description || '',
            image: data.image || null,
            properties: [] // Some backends require initial properties array
        };

        console.log('📡 Sending collection create request (robust):', payload);
        const response = await apiClient.post<any>('/collections', payload);
        const result = response.data;
        return result?.data || result;
    },
    update: async (id: string, data: { title?: string; description?: string; image?: string }) => {
        const response = await apiClient.patch<any>(`/collections/${id}`, data);
        const result = response.data;
        return result?.data || result;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete<any>(`/collections/${id}`);
        return response.data;
    },
    updateProperties: async (id: string, propertyIds: string[]) => {
        // Using PATCH /collections/:id with properties array is a common pattern
        const response = await apiClient.patch<any>(`/collections/${id}`, {
            properties: propertyIds
        });
        const result = response.data;
        return result?.data || result;
    },
    addProperty: async (collectionId: string, propertyId: string) => {
        // Try alternate endpoint structure if the nested one fails
        // Standard REST for many-to-many often uses body for the ID
        const response = await apiClient.post<any>(`/collections/${collectionId}/properties`, {
            propertyId: propertyId
        });
        const result = response.data;
        return result?.data || result;
    },
    removeProperty: async (collectionId: string, propertyId: string) => {
        // Updated to matching structure: DELETE with body or query often used, 
        // but let's try strict REST sub-resource delete if ID is in path, OR body.
        // Given addProperty used body, let's assume standard REST: DELETE /collections/:id/properties with body is rare.
        // Actually, usually it's DELETE /collections/:id/properties/:propId OR DELETE /collections/:id/properties with body.
        // Let's try the body approach to be consistent with add.
        const response = await apiClient.delete<any>(`/collections/${collectionId}/properties`, {
            data: { propertyId: propertyId }
        });
        const result = response.data;
        return result?.data || result;
    },
};
