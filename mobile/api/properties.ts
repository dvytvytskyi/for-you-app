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
  type: 'apartment' | 'villa' | 'penthouse' | 'townhouse' | 'duplex' | 'office';
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
  projectedRoi?: string | null; // For investors
  isInvestorFeatured?: boolean; // For investors
  commission?: string | null; // For agents
  units?: PropertyUnit[];
  facilities: Facility[];
  plannedCompletionAt: string | null;
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
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'price' | 'name' | 'bedrooms';
  sortOrder?: 'ASC' | 'DESC';

  // Specific filters matching backend requirements (GET /api/v1/properties)
  propertyType?: 'off-plan' | 'secondary' | 'all';
  location?: string | string[]; // Dubai Marina, Business Bay
  town?: string | string[]; // Alias for location
  bedrooms?: string; // 0, 1, 2, 3, 4, 5+
  minPrice?: number;
  maxPrice?: number;
  priceFrom?: number; // Alias for minPrice
  priceTo?: number; // Alias for maxPrice
  minSize?: number;
  maxSize?: number;
  sizeFrom?: number; // Alias for minSize
  sizeTo?: number; // Alias for maxSize
  search?: string;
  developerId?: string | number | string[];
  cityId?: string | number;
  areaId?: string | number;
  locationId?: string | string[];
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

export interface Location {
  id: string;
  name: string;
  city?: string;
  cityId?: string;
  label?: string;
}

export interface SearchResult {
  id: string;
  name: string;
  location: string;
  photo: string;
  type: string;
}

export interface FilterOptions {
  locations: Array<{ id: string; name: string }>;
  developers: Array<{ id: string; name: string }>;
  priceRange: { min: number; max: number };
  bedrooms: string[];
}

export const propertiesApi = {
  /**
   * Get list of available locations (districts/areas)
   */
  async getLocations(search?: string): Promise<Location[]> {
    try {
      const response = await publicApiClient.get<{ success: boolean; data: Location[] }>('/locations', {
        params: { search, limit: 100 }
      });
      if (response.data.success) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.warn('Failed to fetch locations:', error);
      return [];
    }
  },

  /**
   * Отримати список properties з фільтрами та пагінацією
   */
  async getAll(filters?: PropertyFilters): Promise<PropertiesResponse> {
    const params: Record<string, any> = {
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };

    // 1. Listings Status (off-plan / secondary)
    if (filters?.propertyType && filters.propertyType !== 'all') {
      params.propertyType = filters.propertyType.toLowerCase();
    }

    // 3. Bedrooms (0, 1, 2, 3, 4, 5+) - Send as array
    if (filters?.bedrooms) {
      params.bedrooms = filters.bedrooms;
    }

    // 4. Location / Town (Dubai Marina, Business Bay) - Send as array
    if (filters?.location || filters?.town) {
      const loc = filters.location || filters.town;
      const locationsList = Array.isArray(loc) ? loc : (typeof loc === 'string' ? loc.split(',').filter(Boolean) : []);
      const normalizedLoc = locationsList.map(l => l.trim());
      params.location = normalizedLoc;
      params.town = normalizedLoc;
    }

    // 5. Price & Size (Aliasing for safety)
    const minP = filters?.minPrice ?? filters?.priceFrom;
    const maxP = filters?.maxPrice ?? filters?.priceTo;
    if (minP !== undefined && minP !== null) {
      params.minPrice = minP;
      params.priceFrom = minP;
    }
    if (maxP !== undefined && maxP !== null) {
      params.maxPrice = maxP;
      params.priceTo = maxP;
      params.price = maxP; // extra alias
    }

    const minS = filters?.minSize ?? filters?.sizeFrom;
    const maxS = filters?.maxSize ?? filters?.sizeTo;
    if (minS !== undefined && minS !== null) {
      params.minSize = minS;
      params.sizeFrom = minS;
    }
    if (maxS !== undefined && maxS !== null) {
      params.maxSize = maxS;
      params.sizeTo = maxS;
    }

    // 6. Sorting
    params.sortBy = filters?.sortBy || 'createdAt';
    params.sortOrder = filters?.sortOrder || 'DESC';

    // 7. Search
    if (filters?.search) {
      params.search = filters.search.toLowerCase();
    }

    if (filters?.developerId) params.developerId = filters.developerId;
    if (filters?.cityId) params.cityId = filters.cityId;
    if (filters?.areaId) params.areaId = filters.areaId;

    console.log('🌐 API Request /properties with params:', JSON.stringify(params, null, 2));

    try {
      const response = await publicApiClient.get<any>('/properties', { params });

      console.log('✅ API Success! URL:', response.config.url);

      const rawData = response.data?.data;
      let properties: Property[] = [];
      let pagination: PropertiesPagination = {
        total: 0,
        page: params.page || 1,
        limit: params.limit || 20,
        totalPages: 1,
      };

      // Handle different response formats
      if (rawData) {
        if (Array.isArray(rawData)) {
          properties = rawData;
          pagination.total = properties.length;
        } else if (rawData.data && Array.isArray(rawData.data)) {
          properties = rawData.data;
          if (rawData.pagination) {
            pagination = rawData.pagination;
          } else {
            pagination.total = properties.length;
          }
        }
      }

      // Log first property for debugging missing fields
      if (properties.length > 0) {
        console.log('🔍 PROBE: Raw first property from backend:', JSON.stringify(rawData?.data?.[0] || rawData?.[0], null, 2));
      }

      return {
        success: true,
        data: {
          data: properties,
          pagination: pagination
        }
      };
    } catch (error) {
      console.error('❌ Properties API Error:', error);
      throw error;
    }
  },

  /**
   * Отримати список проектів (off-plan) з фільтрами та пагінацією
   * Використовує новий оптимізований ендпоінт /projects
   */
  async getProjects(filters?: PropertyFilters & { isInvestor?: boolean, isAgent?: boolean }): Promise<PropertiesResponse> {
    const params: Record<string, any> = {
      page: filters?.page || 1,
      limit: filters?.limit || 20,
    };

    // Filters for projects
    if (filters?.search) params.search = filters.search.toLowerCase();
    if (filters?.locationId) params.locationId = filters.locationId;
    if (filters?.cityId) params.cityId = filters.cityId;
    if (filters?.developerId) params.developerId = filters.developerId;

    if (filters?.minPrice) params.minPrice = filters.minPrice;
    if (filters?.maxPrice) params.maxPrice = filters.maxPrice;

    if (filters?.bedrooms) {
      params.bedrooms = filters.bedrooms;
    }

    // Persona specific flags
    if (filters?.isInvestor) params.isInvestor = true;
    if (filters?.isInvestor) params.isInvestor = true;
    if (filters?.isAgent) params.isAgent = true;

    // Sorting
    if (filters?.sortBy) params.sortBy = filters.sortBy;
    if (filters?.sortOrder) params.sortOrder = filters.sortOrder;

    console.log('🌐 API Request /projects with params:', JSON.stringify(params, null, 2));

    // Використовуємо повний URL як вказано в документації, щоб не залежати від baseURL
    const PROJECTS_URL = 'https://admin.foryou-realestate.com/api/public/projects';

    try {
      const response = await publicApiClient.get<any>(PROJECTS_URL, { params });

      const rawData = response.data?.data;
      let projects: Property[] = [];
      let pagination: PropertiesPagination = {
        total: 0,
        page: params.page,
        limit: params.limit,
        totalPages: 1,
      };

      if (rawData) {
        if (Array.isArray(rawData)) {
          projects = rawData;
          pagination.total = projects.length;
        } else if (rawData.data && Array.isArray(rawData.data)) {
          projects = rawData.data;
          pagination = rawData.pagination || { ...pagination, total: projects.length };
        }
      }

      return {
        success: true,
        data: {
          data: projects,
          pagination: pagination
        }
      };
    } catch (error) {
      console.error('❌ Projects API Error:', error);
      throw error;
    }
  },

  /**
   * Отримати property за ID
   */
  async getById(id: string): Promise<PropertyResponse> {
    const response = await publicApiClient.get<PropertyResponse>(`/properties/${id}`);
    return response.data;
  },

  /**
   * Отримати статистику properties
   */
  async getStats(): Promise<PropertiesStats> {
    const response = await publicApiClient.get<PropertiesStats>('/properties/stats');
    return response.data;
  },

  /**
   * Autocomplete пошук проектів (вертає до 10 результатів)
   */
  async autocompleteSearch(query: string): Promise<SearchResult[]> {
    try {
      const PROJECTS_SEARCH_URL = 'https://admin.foryou-realestate.com/api/public/projects/search';
      const response = await publicApiClient.get<{ success: boolean; data: SearchResult[] }>(PROJECTS_SEARCH_URL, {
        params: { q: query }
      });
      return response.data?.success ? response.data.data : [];
    } catch (error) {
      console.warn('Autocomplete search failed:', error);
      return [];
    }
  },

  /**
   * Отримати метадані для фільтрів проектів одним запитом
   */
  async getFilterOptions(): Promise<FilterOptions | null> {
    try {
      const FILTER_OPTIONS_URL = 'https://admin.foryou-realestate.com/api/public/projects/filter-options';
      const response = await publicApiClient.get<{ success: boolean; data: FilterOptions }>(FILTER_OPTIONS_URL);
      return response.data?.success ? response.data.data : null;
    } catch (error) {
      console.warn('Failed to fetch filter options:', error);
      return null;
    }
  },
};

/**
 * Конвертує формат property з локального бекенду в формат адмін-панелі
 */
export function convertBackendPropertyToAdminFormat(backendProp: any): Property {
  const hasCompletionDate = backendProp.plannedCompletionAt && new Date(backendProp.plannedCompletionAt) > new Date();
  const hasPaymentPlans = backendProp.paymentPlans && Array.isArray(backendProp.paymentPlans) && backendProp.paymentPlans.length > 0;
  const isSoldOut = backendProp.isSoldOut === true;
  const isOffPlan = (hasCompletionDate || hasPaymentPlans) && !isSoldOut;

  let photos: string[] = [];
  if (backendProp.images && Array.isArray(backendProp.images)) {
    photos = backendProp.images.map((img: any) => {
      if (typeof img === 'string') return img;
      return img.url || img.fileUrl || img.s3Key || '';
    }).filter((url: string) => url && url.length > 0);
  }
  if (photos.length === 0 && backendProp.mainPhotoUrl) photos = [backendProp.mainPhotoUrl];

  const facilities = (backendProp.amenities || []).map((amenity: any) => ({
    id: amenity.id || '',
    nameEn: amenity.name || amenity.nameEn || '',
    nameRu: amenity.nameRu || '',
    nameAr: amenity.nameAr || '',
    iconName: amenity.icon || 'home',
  }));

  const addressParts = backendProp.address ? backendProp.address.split(',') : [];
  const cityName = addressParts.length > 1 ? addressParts[addressParts.length - 1].trim() : 'Dubai';
  const areaName = backendProp.districts?.[0] || addressParts[0]?.trim() || 'Unknown';

  if (isOffPlan) {
    return {
      id: backendProp.id,
      propertyType: 'off-plan',
      name: backendProp.titleEn || 'Untitled',
      description: backendProp.descriptionEn || '',
      photos: photos,
      country: { id: '', nameEn: 'UAE', nameRu: 'ОАЭ', nameAr: '', code: 'AE' },
      city: { id: '', nameEn: cityName, nameRu: 'Дубай', nameAr: '' },
      area: areaName,
      developer: backendProp.developer ? {
        id: backendProp.developer.id || '',
        name: backendProp.developer.name || '',
        logo: backendProp.developer.logo || null,
        description: backendProp.developer.description || null,
      } : null,
      latitude: backendProp.latitude || 0,
      longitude: backendProp.longitude || 0,
      priceFrom: backendProp.minPrice || 0,
      priceFromAED: (backendProp.minPrice || 0) * 3.673,
      bedroomsFrom: 1,
      bedroomsTo: 5,
      bathroomsFrom: 1,
      bathroomsTo: 4,
      sizeFrom: 0,
      sizeTo: 0,
      paymentPlan: backendProp.paymentPlans?.[0]?.name || null,
      units: backendProp.units || [],
      facilities: facilities,
      plannedCompletionAt: backendProp.plannedCompletionAt || null,
      createdAt: backendProp.createdAt || new Date().toISOString(),
      updatedAt: backendProp.updatedAt || new Date().toISOString(),
    };
  } else {
    return {
      id: backendProp.id,
      propertyType: 'secondary',
      name: backendProp.titleEn || 'Untitled',
      description: backendProp.descriptionEn || '',
      photos: photos,
      country: { id: '', nameEn: 'UAE', nameRu: 'ОАЭ', nameAr: '', code: 'AE' },
      city: { id: '', nameEn: cityName, nameRu: 'Дубай', nameAr: '' },
      area: { id: '', nameEn: areaName, nameRu: '', nameAr: '' },
      developer: null,
      latitude: backendProp.latitude || 0,
      longitude: backendProp.longitude || 0,
      price: backendProp.minPrice || backendProp.maxPrice || 0,
      priceAED: (backendProp.minPrice || 0) * 3.673,
      bedrooms: backendProp.bedrooms || 2,
      bathrooms: backendProp.bathrooms || 2,
      size: backendProp.size || 0,
      sizeSqft: (backendProp.size || 0) * 10.764,
      facilities: facilities,
      createdAt: backendProp.createdAt || new Date().toISOString(),
      updatedAt: backendProp.updatedAt || new Date().toISOString(),
    };
  }
}
