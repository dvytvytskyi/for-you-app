import { publicApiClient } from './public-api-client';
import { backendApiClient } from './backend-client';

// Типи відповідно до документації API
export interface Country {
  id: string;
  nameEn: string;
  nameRu: string;
  nameAr: string;
  code: string;
}

export interface City {
  id: string;
  nameEn: string;
  nameRu: string;
  nameAr: string;
  countryId?: string;
  country?: Country;
}

export interface Area {
  id: string;
  nameEn: string;
  nameRu: string;
  nameAr: string;
  cityId?: string;
  city?: City;
  description?: string | null;
  infrastructure?: string | null;
  images?: string[] | null;
}

export interface Developer {
  id: string;
  name: string;
  logo: string | null;
  description: string | null;
  createdAt?: string;
}

export interface Facility {
  id: string;
  nameEn: string;
  nameRu: string;
  nameAr: string;
  iconName: string;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitId: string;
  type: 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'office';
  planImage: string | null;
  totalSize: string; // Decimal як string
  balconySize: string | null; // Decimal як string
  price: string; // Decimal як string (AED)
  // Опціональні поля, які можуть бути в API
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  photos?: string[]; // Додаткові фото
}

// Off-plan property
export interface OffPlanProperty {
  id: string;
  propertyType: 'off-plan';
  name: string;
  description: string;
  photos: string[];
  country: Country;
  city: City;
  area: string; // "areaName, cityName"
  developer: Developer | null;
  latitude: number | string; // Може бути рядком з API
  longitude: number | string; // Може бути рядком з API
  priceFrom: number | string; // Може бути рядком з API
  priceFromAED?: number;
  bedroomsFrom: number;
  bedroomsTo: number;
  bathroomsFrom: number;
  bathroomsTo: number;
  sizeFrom: number | string; // Може бути рядком з API
  sizeTo: number | string; // Може бути рядком з API
  sizeFromSqft?: number;
  sizeToSqft?: number;
  paymentPlan: string | null;
  units?: PropertyUnit[];
  facilities: Facility[];
  createdAt: string;
  updatedAt: string;
}

// Secondary property
export interface SecondaryProperty {
  id: string;
  propertyType: 'secondary';
  name: string;
  description: string;
  photos: string[];
  country: Country;
  city: City;
  area: {
    id: string;
    nameEn: string;
    nameRu: string;
    nameAr: string;
  };
  developer: null;
  latitude: number;
  longitude: number;
  price: number;
  priceAED: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  sizeSqft: number;
  facilities: Facility[];
  createdAt: string;
  updatedAt: string;
}

export type Property = OffPlanProperty | SecondaryProperty;

export interface PropertyFilters {
  propertyType?: 'off-plan' | 'secondary';
  developerId?: string;
  cityId?: string;
  areaId?: string;
  bedrooms?: string; // "1,2,3"
  sizeFrom?: number;
  sizeTo?: number;
  priceFrom?: number;
  priceTo?: number;
  search?: string;
  sortBy?: 'createdAt' | 'name' | 'price' | 'priceFrom' | 'size' | 'sizeFrom';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface PropertiesPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PropertiesResponse {
  success: boolean;
  data: {
    data: Property[];
    pagination: PropertiesPagination;
  };
}

export interface PropertyResponse {
  success: boolean;
  data: Property;
}

export interface PropertiesStats {
  success: boolean;
  data: {
    totalProperties: number;
    offPlanProperties: number;
    secondaryProperties: number;
    minPrice: number;
    maxPrice: number;
    topCities: Array<{ name: string; count: number }>;
    bedroomsDistribution: Array<{ name: string; count: number }>;
    unitTypesDistribution: Array<{ name: string; count: number }>;
  };
}

export const propertiesApi = {
  /**
   * Отримати список properties з фільтрами та пагінацією
   */
  async getAll(filters?: PropertyFilters): Promise<PropertiesResponse> {
    // Використовуємо publicApiClient для публічних properties (з API ключами)
    const params: Record<string, any> = {
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };

    if (filters?.propertyType) params.propertyType = filters.propertyType;
    if (filters?.developerId) params.developerId = filters.developerId;
    if (filters?.cityId) params.cityId = filters.cityId;
    if (filters?.areaId) params.areaId = filters.areaId;
    if (filters?.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters?.sizeFrom) params.sizeFrom = filters.sizeFrom;
    if (filters?.sizeTo) params.sizeTo = filters.sizeTo;
    if (filters?.priceFrom) params.priceFrom = filters.priceFrom;
    if (filters?.priceTo) params.priceTo = filters.priceTo;
    if (filters?.search) params.search = filters.search;
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    console.log('🌐 Admin Panel API Request to /properties with params:', params);
    
    try {
      const response = await publicApiClient.get<PropertiesResponse>('/properties', { params });
      
      console.log('📥 Admin Panel API Response:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
        hasProperties: !!response.data?.data?.data,
        propertiesCount: response.data?.data?.data?.length || 0,
        fullResponse: response.data ? JSON.stringify(response.data, null, 2).substring(0, 500) : 'null', // Перші 500 символів для діагностики
      });
      
      // Адмін-панель повертає: { success: true, data: { data: [...], pagination: {...} } }
      if (response.data && response.data.success && response.data.data) {
        const propertiesCount = response.data.data.data?.length || 0;
        console.log('✅ Returning properties data from admin panel:', propertiesCount);
        
        // Якщо properties є, повертаємо їх
        if (propertiesCount > 0) {
          return response.data;
        } else {
          console.warn('⚠️ API returned success but no properties in response');
          // Повертаємо порожню відповідь з правильним форматом
          return {
            success: true,
            data: {
              data: [],
              pagination: {
                total: 0,
                page: params.page || 1,
                limit: params.limit || 20,
                totalPages: 0,
              },
            },
          };
        }
      }
      
      const unexpectedResponseStr = response.data 
        ? JSON.stringify(response.data, null, 2).substring(0, 500)
        : 'null';
      console.warn('⚠️ Response format unexpected:', unexpectedResponseStr);
      
      // Повертаємо порожню відповідь з правильним форматом
      return {
        success: false,
        data: {
          data: [],
          pagination: {
            total: 0,
            page: params.page || 1,
            limit: params.limit || 20,
            totalPages: 0,
          },
        },
      };
    } catch (error: any) {
      console.error('❌ Error fetching properties from admin panel:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Повертаємо порожню відповідь з правильним форматом
      throw error;
    }
  },

  /**
   * Отримати property за ID
   */
  async getById(id: string): Promise<PropertyResponse> {
    const response = await publicApiClient.get<PropertyResponse>(`/properties/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data;
    }
    
    return response.data;
  },

  /**
   * Отримати статистику properties
   */
  async getStats(): Promise<PropertiesStats> {
    const response = await publicApiClient.get<PropertiesStats>('/properties/stats');
    
    if (response.data.success && response.data.data) {
      return response.data;
    }
    
    return response.data;
  },
};

/**
 * Конвертує формат property з локального бекенду в формат адмін-панелі
 */
function convertBackendPropertyToAdminFormat(backendProp: any): Property {
  // Локальний бекенд використовує enum типи: residential_complex, villa, apartment, townhouse, penthouse, land
  // Вважаємо всі properties як off-plan (новобудови), оскільки локальний бекенд не розрізняє off-plan/secondary
  // Або можна використовувати plannedCompletionAt для визначення
  const hasCompletionDate = backendProp.plannedCompletionAt && new Date(backendProp.plannedCompletionAt) > new Date();
  const isOffPlan = hasCompletionDate || true; // Поки що вважаємо всі як off-plan
  
  // Обробка images - може бути масив об'єктів або масив рядків
  let photos: string[] = [];
  if (backendProp.images && Array.isArray(backendProp.images)) {
    photos = backendProp.images.map((img: any) => {
      if (typeof img === 'string') return img;
      return img.url || img.fileUrl || img.s3Key || '';
    }).filter((url: string) => url && url.length > 0);
  }
  if (photos.length === 0 && backendProp.mainPhotoUrl) {
    photos = [backendProp.mainPhotoUrl];
  }
  if (photos.length === 0 && backendProp.logoUrl) {
    photos = [backendProp.logoUrl];
  }
  
  // Обробка amenities
  const facilities = (backendProp.amenities || []).map((amenity: any) => ({
    id: amenity.id || amenity.amenityId || '',
    nameEn: amenity.name || amenity.nameEn || amenity.amenityType || '',
    nameRu: amenity.nameRu || '',
    nameAr: amenity.nameAr || '',
    iconName: amenity.icon || amenity.iconName || 'home',
  }));
  
  // Обробка address/districts для location
  const addressParts = backendProp.address ? backendProp.address.split(',') : [];
  const cityName = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Dubai';
  const areaName = backendProp.districts && Array.isArray(backendProp.districts) && backendProp.districts.length > 0
    ? backendProp.districts[0]
    : (addressParts.length > 0 ? addressParts[0].trim() : 'Unknown');
  
  if (isOffPlan) {
    return {
      id: backendProp.id,
      propertyType: 'off-plan',
      name: backendProp.titleEn || backendProp.titleRu || backendProp.titleAr || 'Untitled',
      description: backendProp.descriptionEn || backendProp.descriptionRu || backendProp.descriptionAr || '',
      photos: photos,
      country: {
        id: '',
        nameEn: 'UAE',
        nameRu: 'ОАЭ',
        nameAr: 'الإمارات',
        code: 'AE',
      },
      city: {
        id: '',
        nameEn: cityName,
        nameRu: 'Дубай',
        nameAr: 'دبي',
      },
      area: areaName,
      developer: backendProp.developer ? {
        id: backendProp.developer.id || '',
        name: backendProp.developer.name || '',
        logo: backendProp.developer.logo || null,
        description: backendProp.developer.description || null,
      } : null,
      latitude: backendProp.latitude || 0,
      longitude: backendProp.longitude || 0,
      priceFrom: backendProp.minPrice ? parseFloat(String(backendProp.minPrice)) : 0,
      priceFromAED: backendProp.minPrice ? (parseFloat(String(backendProp.minPrice)) * 3.673) : undefined,
      bedroomsFrom: 1,
      bedroomsTo: 5,
      bathroomsFrom: 1,
      bathroomsTo: 4,
      sizeFrom: 0,
      sizeTo: 0,
      paymentPlan: backendProp.paymentPlans && Array.isArray(backendProp.paymentPlans) && backendProp.paymentPlans.length > 0
        ? (backendProp.paymentPlans[0].name || backendProp.paymentPlans[0].title || null)
        : null,
      units: [],
      facilities: facilities,
      createdAt: backendProp.createdAt || new Date().toISOString(),
      updatedAt: backendProp.updatedAt || new Date().toISOString(),
    };
  } else {
    return {
      id: backendProp.id,
      propertyType: 'secondary',
      name: backendProp.titleEn || backendProp.titleRu || backendProp.titleAr || 'Untitled',
      description: backendProp.descriptionEn || backendProp.descriptionRu || backendProp.descriptionAr || '',
      photos: photos,
      country: {
        id: '',
        nameEn: 'UAE',
        nameRu: 'ОАЭ',
        nameAr: 'الإمارات',
        code: 'AE',
      },
      city: {
        id: '',
        nameEn: cityName,
        nameRu: 'Дубай',
        nameAr: 'دبي',
      },
      area: {
        id: '',
        nameEn: areaName,
        nameRu: '',
        nameAr: '',
      },
      developer: null,
      latitude: backendProp.latitude ? parseFloat(String(backendProp.latitude)) : 0,
      longitude: backendProp.longitude ? parseFloat(String(backendProp.longitude)) : 0,
      price: backendProp.minPrice ? parseFloat(String(backendProp.minPrice)) : (backendProp.maxPrice ? parseFloat(String(backendProp.maxPrice)) : 0),
      priceAED: backendProp.minPrice ? (parseFloat(String(backendProp.minPrice)) * 3.673) : undefined,
      bedrooms: 2,
      bathrooms: 2,
      size: 0,
      sizeSqft: 0,
      facilities: facilities,
      createdAt: backendProp.createdAt || new Date().toISOString(),
      updatedAt: backendProp.updatedAt || new Date().toISOString(),
    };
  }
}
