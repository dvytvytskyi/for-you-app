import { backendApiClient } from './backend-client';
import { ProjectResponse, ProjectData } from '@/types/project';
import { propertiesApi, OffPlanProperty, Property } from './properties';

export const projectsApi = {
    /**
     * Отримати деталі проекту за ID
     */
    async getById(id: string): Promise<ProjectResponse> {
        let lastError = null;

        // 1. Try Public Properties API (Standard User Flow)
        try {
            console.log('🔄 Attempt 1: Fetching via propertiesApi (Public):', id);
            const propertyResponse = await propertiesApi.getById(id);
            if (propertyResponse.success && propertyResponse.data) {
                console.log('✅ Attempt 1 Success');
                return { success: true, data: this.mapPropertyToProject(propertyResponse.data) };
            }
        } catch (error) {
            console.warn('⚠️ Attempt 1 Failed:', error);
            lastError = error;
        }

        // 2. Try Native Projects API (Future Endpoint)
        try {
            console.log('🔄 Attempt 2: Fetching via backendApiClient (Projects):', id);
            const response = await backendApiClient.get<ProjectResponse>(`/projects/${id}`);
            console.log('✅ Attempt 2 Success');
            return response.data;
        } catch (error) {
            console.warn('⚠️ Attempt 2 Failed:', error);
            lastError = error;
        }

        // 3. Try Admin Properties API (Authenticated Flow)
        try {
            console.log('🔄 Attempt 3: Fetching via backendApiClient (Properties Admin):', id);
            const response = await backendApiClient.get(`/properties/${id}`);
            if (response.data && (response.data.success || response.data.data)) {
                const propData = response.data.data || response.data;
                console.log('✅ Attempt 3 Success');
                return { success: true, data: this.mapPropertyToProject(propData) };
            }
        } catch (error) {
            console.warn('⚠️ Attempt 3 Failed:', error);
            lastError = error;
        }

        // 4. Last Resort: Mock Data
        console.warn('⚠️ All Network Attempts Failed. Returning Fallback Mock Data.');
        return {
            success: true,
            data: this.getMockProject(id)
        };
    },

    getMockProject(id: string): ProjectData {
        return {
            id: id,
            name: "Wellington Ocean Walk (Offline Mode)",
            location: "Dubai Islands, Dubai",
            coordinates: { latitude: 25.3004, longitude: 55.3154 },

            // Mock Stats
            bedrooms: '2 - 4',
            bathrooms: '3 - 5',
            size: '1,500 - 3,200',
            sizeUnit: 'Sq. Ft.',

            financials: {
                totalPurchase: 'AED 2,400,000',
                estSalePrice: 'AED 3,240,000',
                annualCashFlow: 'AED 192,000',
                avgAppreciation: '15.5%',
                rentEst3Years: 'AED 576,000'
            },

            completion: 'Q4 2026',

            gallery: [
                "https://api.reelly.io/vault/ZZLvFZFt/L7JyAHRYi9AwN_r7FY4fpBQ0W6w/lRWMgA../0.jpg",
                "https://api.reelly.io/vault/ZZLvFZFt/rhWDZMhW1oZQm26_LElQEWGx0n0/6OkBMA../0.jpg",
                "https://api.reelly.io/vault/ZZLvFZFt/VJQ56v7Yg4A7iUBcfnXb6BKJTf0/YI5SWQ../3.jpg"
            ],
            description: "⚠️ Network Error: Unable to load live data. Displaying cached/demo content.\n\nThis is a stunning waterfront project bringing island living to your doorstep. (Demo Description)",
            purchasedUnit: {
                unitId: 'A-1205',
                unitType: '2 Bedroom Apartment',
                size: '1,450 sq. ft',
                purchaseDate: '15 Oct 2023',
                floorPlans: ["https://api.reelly.io/vault/ZZLvFZFt/L7JyAHRYi9AwN_r7FY4fpBQ0W6w/lRWMgA../0.jpg"],
                projectPhotos: ["https://api.reelly.io/vault/ZZLvFZFt/VJQ56v7Yg4A7iUBcfnXb6BKJTf0/YI5SWQ../3.jpg"],
                documents: [
                    { id: '1', title: 'Brochure (Demo)', description: 'Project Details', fileUrl: 'https://example.com/demo.pdf' }
                ]
            },
            area: {
                name: "Dubai Islands",
                description: "A prestigious waterfront location.",
                photos: ["https://api.reelly.io/vault/ZZLvFZFt/rhWDZMhW1oZQm26_LElQEWGx0n0/6OkBMA../0.jpg"]
            }
        };
    },

    /**
     * Отримати URL для генерації PDF проекту
     */
    getPdfUrl(id: string): string {
        const baseUrl = backendApiClient.defaults.baseURL || 'https://admin.foryou-realestate.com/api/v1';
        return `${baseUrl}/projects/${id}/pdf`;
    },

    /**
     * Маппінг Property -> ProjectData
     */
    mapPropertyToProject(property: Property): ProjectData {
        const isOffPlan = property.propertyType === 'off-plan';
        const offPlanData = isOffPlan ? (property as OffPlanProperty) : null;

        // Формуємо локацію
        const city = property.city?.nameEn || '';

        // Handle area safely regardless of whether it's a string or object
        // In some API responses area is a string "Area Name", in others it might be an object
        let areaName = '';
        if (isOffPlan && offPlanData?.area) {
            if (typeof offPlanData.area === 'object') {
                // @ts-ignore - runtime check to be safe
                areaName = offPlanData.area.nameEn || offPlanData.area.name || 'Unknown Area';
            } else {
                areaName = String(offPlanData.area);
            }
        } else if (!isOffPlan && property.area) {
            if (typeof property.area === 'object') {
                areaName = property.area.nameEn || 'Unknown Area';
            } else {
                areaName = String(property.area);
            }
        }

        const location = [areaName, city].filter(Boolean).join(', ');

        // Mock coordinates if missing (Dubai default)
        const latitude = Number(property.latitude) || 25.2048;
        const longitude = Number(property.longitude) || 55.2708;

        return {
            id: property.id,
            name: property.name,
            location: location,
            coordinates: {
                latitude,
                longitude
            },

            // Stats (Mapped)
            bedrooms: isOffPlan && offPlanData
                ? `${offPlanData.bedroomsFrom ?? 1} - ${offPlanData.bedroomsTo ?? 5}`
                : String((property as any).bedrooms || '2'),
            bathrooms: isOffPlan && offPlanData
                ? `${offPlanData.bathroomsFrom ?? 1} - ${offPlanData.bathroomsTo ?? 6}`
                : String((property as any).bathrooms || '2'),
            size: isOffPlan && offPlanData
                ? `${offPlanData.sizeFrom ?? 700} - ${offPlanData.sizeTo ?? 5000}`
                : String((property as any).size || (property as any).totalSize || '1200'),
            sizeUnit: 'Sq. Ft.',

            financials: {
                totalPurchase: isOffPlan && offPlanData
                    ? `AED ${Number(offPlanData.priceFrom).toLocaleString('en-US')}`
                    : `AED ${Number((property as any).price || 0).toLocaleString('en-US')}`,
                estSalePrice: isOffPlan && offPlanData
                    ? `AED ${(Number(offPlanData.priceFrom) * 1.35).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                    : `AED ${(Number((property as any).price || 0) * 1.35).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                annualCashFlow: isOffPlan && offPlanData
                    ? `AED ${(Number(offPlanData.priceFrom) * 0.08).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                    : `AED ${(Number((property as any).price || 0) * 0.08).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                avgAppreciation: '15.5%',
                rentEst3Years: isOffPlan && offPlanData
                    ? `AED ${(Number(offPlanData.priceFrom) * 0.25).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                    : `AED ${(Number((property as any).price || 0) * 0.25).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
            },

            completion: isOffPlan && offPlanData && offPlanData.plannedCompletionAt
                ? new Date(offPlanData.plannedCompletionAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : 'Ready to Move',

            gallery: property.photos || [],
            description: property.description || 'No description available.',

            // Mocking purchased unit details since Property API doesn't have them structure yet
            purchasedUnit: {
                unitId: 'A-104',
                unitType: isOffPlan ? 'Off-Plan Unit' : 'Apartment',
                size: isOffPlan && offPlanData
                    ? String(offPlanData.sizeFrom || offPlanData.sizeFromSqft || '1,200') + ' Sq. Ft.'
                    : String((property as any).size || (property as any).totalSize || '1,200') + ' Sq. Ft.',
                purchaseDate: new Date(property.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),

                floorPlans: (property as any).floorPlans || [],
                projectPhotos: (property as any).projectPhotos || [],
                documents: (property as any).documents || []
            },

            area: {
                name: areaName || 'Unknown Area',
                description: 'This area is known for its luxury developments and proximity to key city landmarks.',
                photos: property.photos?.slice(0, 3) || []
            }
        };
    }
};
