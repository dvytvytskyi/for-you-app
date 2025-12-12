import { Property, OffPlanProperty, SecondaryProperty } from '@/api/properties';

/**
 * Конвертує API Property в формат для UI
 */
export interface PropertyCardData {
  id: string;
  title: string;
  location: string;
  price: number;
  priceAED?: number;
  bedrooms: number | string; // "1-3" або 2
  type: 'off-plan' | 'secondary';
  images: string[];
  handoverDate?: string;
  paymentPlan?: string | null;
  isFavorite?: boolean;
}

/**
 * Конвертує Property з API в формат для картки
 */
export function convertPropertyToCard(property: Property): PropertyCardData {
  const isOffPlan = property.propertyType === 'off-plan';
  const offPlanProperty = property as OffPlanProperty;
  const secondaryProperty = property as SecondaryProperty;

  // Визначаємо локацію
  let location: string;
  if (isOffPlan) {
    // Обробляємо area - може бути рядком або об'єктом Area
    let areaStr: string;
    if (typeof offPlanProperty.area === 'string') {
      areaStr = offPlanProperty.area;
    } else if (offPlanProperty.area && typeof offPlanProperty.area === 'object' && 'nameEn' in offPlanProperty.area) {
      areaStr = (offPlanProperty.area as any).nameEn || '';
    } else {
      areaStr = '';
    }
    
    // Обробляємо city - переконуємося, що це рядок
    const cityName = offPlanProperty.city?.nameEn || offPlanProperty.city?.nameRu || '';
    
    location = areaStr || cityName || 'Unknown location';
  } else {
    // Обробляємо area для secondary property
    let areaStr: string;
    if (typeof secondaryProperty.area === 'string') {
      areaStr = secondaryProperty.area;
    } else if (secondaryProperty.area && typeof secondaryProperty.area === 'object' && 'nameEn' in secondaryProperty.area) {
      areaStr = secondaryProperty.area.nameEn || secondaryProperty.area.nameRu || '';
    } else {
      areaStr = '';
    }
    
    // Обробляємо city
    const cityName = secondaryProperty.city?.nameEn || secondaryProperty.city?.nameRu || '';
    
    location = areaStr && cityName ? `${areaStr}, ${cityName}` : (areaStr || cityName || 'Unknown location');
  }

  // Визначаємо ціну (конвертуємо рядки в числа якщо потрібно)
  let price: number;
  if (isOffPlan) {
    price = typeof offPlanProperty.priceFrom === 'string' 
      ? parseFloat(offPlanProperty.priceFrom) || 0
      : (offPlanProperty.priceFrom as number);
  } else {
    price = typeof secondaryProperty.price === 'string'
      ? parseFloat(secondaryProperty.price) || 0
      : (secondaryProperty.price as number);
  }
  
  const priceAED = isOffPlan 
    ? (offPlanProperty.priceFromAED || price * 3.673)
    : (secondaryProperty.priceAED || price * 3.673);

  // Визначаємо кількість спалень
  let bedrooms: number | string;
  if (isOffPlan) {
    const from = typeof offPlanProperty.bedroomsFrom === 'number' ? offPlanProperty.bedroomsFrom : 0;
    const to = typeof offPlanProperty.bedroomsTo === 'number' ? offPlanProperty.bedroomsTo : 0;
    bedrooms = from === to ? from : `${from}-${to}`;
  } else {
    const beds = secondaryProperty.bedrooms;
    bedrooms = typeof beds === 'number' ? beds : (typeof beds === 'string' ? beds : 0);
  }

  // Гарантуємо, що title є рядком
  const title = typeof property.name === 'string' ? property.name : String(property.name || 'Untitled');
  
  // Гарантуємо, що images є масивом рядків з валідними URI
  let images: string[] = [];
  if (Array.isArray(property.photos)) {
    images = property.photos
      .filter((photo): photo is string => typeof photo === 'string' && photo.length > 0)
      .filter(photo => {
        // Перевіряємо, чи це валідний URI
        try {
          // Перевіряємо, чи це URL або data URI
          if (photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('data:') || photo.startsWith('file://')) {
            return true;
          }
          // Якщо це не URL, але не порожній рядок, все одно додаємо (може бути локальний шлях)
          return photo.trim().length > 0;
        } catch {
          return false;
        }
      });
  }
  
  // Якщо немає зображень, додаємо placeholder
  if (images.length === 0) {
    images = ['https://via.placeholder.com/400x300?text=No+Image'];
  }

  // Форматуємо дату завершення (handover date)
  let handoverDate: string | undefined;
  if (isOffPlan && (offPlanProperty as any).plannedCompletionAt) {
    const completionDate = new Date((offPlanProperty as any).plannedCompletionAt);
    if (!isNaN(completionDate.getTime())) {
      handoverDate = completionDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  }

  return {
    id: String(property.id || ''),
    title,
    location: String(location || 'Unknown location'),
    price: typeof price === 'number' ? price : 0,
    priceAED: typeof priceAED === 'number' ? priceAED : undefined,
    bedrooms,
    type: property.propertyType,
    images,
    handoverDate,
    paymentPlan: isOffPlan ? (typeof offPlanProperty.paymentPlan === 'string' ? offPlanProperty.paymentPlan : null) : null,
    isFavorite: false, // TODO: додати логіку для favorites
  };
}

/**
 * Форматує ціну для відображення
 */
export function formatPrice(price: number, currency: 'USD' | 'AED' = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : 'AED';
  if (price >= 1000000) {
    return `${symbol}${(price / 1000000).toFixed(2)}M`;
  }
  if (price >= 1000) {
    return `${symbol}${(price / 1000).toFixed(0)}K`;
  }
  return `${symbol}${price.toLocaleString()}`;
}

/**
 * Конвертує фільтри з UI в формат API
 */
export interface UIFilters {
  listingType: 'offplan' | 'secondary';
  minPrice: number | null;
  maxPrice: number | null;
  propertyType: string;
  bedrooms: string; // "any" або "1,2,3"
  location: string;
}

export function convertFiltersToAPI(uiFilters: UIFilters): {
  propertyType?: 'off-plan' | 'secondary';
  priceFrom?: number;
  priceTo?: number;
  bedrooms?: string;
  search?: string;
} {
  const apiFilters: any = {};

  // Property type
  if (uiFilters.listingType === 'offplan') {
    apiFilters.propertyType = 'off-plan';
  } else if (uiFilters.listingType === 'secondary') {
    apiFilters.propertyType = 'secondary';
  }

  // Price range
  if (uiFilters.minPrice) {
    apiFilters.priceFrom = uiFilters.minPrice;
  }
  if (uiFilters.maxPrice) {
    apiFilters.priceTo = uiFilters.maxPrice;
  }

  // Bedrooms
  if (uiFilters.bedrooms && uiFilters.bedrooms !== 'any') {
    apiFilters.bedrooms = uiFilters.bedrooms;
  }

  return apiFilters;
}
