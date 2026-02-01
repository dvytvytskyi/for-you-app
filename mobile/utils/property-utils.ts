import { Property, OffPlanProperty, SecondaryProperty, PropertyFilters } from '@/api/properties';

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
  projectedRoi?: string | null;
  commission?: string | null;
  isInvestorFeatured?: boolean;
  isFavorite?: boolean;
  developerName?: string | null;
}

/**
 * Конвертує Property з API в формат для картки
 */
export function convertPropertyToCard(property: Property, favoriteIds: string[] = []): PropertyCardData {
  // Якщо запит прийшов з ендпоінту /projects, об'єкти часто не мають поля propertyType,
  // але мають priceFrom та bedroomsFrom. Вважаємо такий об'єкт Off-plan.
  const isOffPlan = property.propertyType === 'off-plan' || ('priceFrom' in property) || ('bedroomsFrom' in property);

  const offPlanProperty = property as any; // Використовуємо any для гнучкості з полями проекту
  const secondaryProperty = property as any;

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
    // images = ['https://via.placeholder.com/400x300?text=No+Image'];
    // Use local "new logo blue.png" as placeholder if no images
    images = []; // We will handle empty images array in UI by showing placeholder asset
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

  // Check if favorites logic is implemented
  const isFavorite = favoriteIds.includes(String(property.id));

  // Extract developer name for off-plan properties
  let developerName: string | null = null;
  if (isOffPlan && offPlanProperty.developer) {
    if (typeof offPlanProperty.developer === 'object' && 'name' in offPlanProperty.developer) {
      developerName = offPlanProperty.developer.name;
    } else if (typeof offPlanProperty.developer === 'string') {
      developerName = offPlanProperty.developer;
    }
  }

  return {
    id: String(property.id || ''),
    title,
    location: String(location || 'Unknown location'),
    price: typeof price === 'number' ? price : 0,
    priceAED: typeof priceAED === 'number' ? priceAED : undefined,
    bedrooms,
    type: isOffPlan ? 'off-plan' : (property.propertyType || 'secondary'),
    images,
    handoverDate,
    paymentPlan: isOffPlan ? (typeof offPlanProperty.paymentPlan === 'string' ? offPlanProperty.paymentPlan : null) : null,
    projectedRoi: isOffPlan ? offPlanProperty.projectedRoi : undefined,
    commission: isOffPlan ? offPlanProperty.commission : undefined,
    isInvestorFeatured: isOffPlan ? offPlanProperty.isInvestorFeatured : undefined,
    isFavorite,
    developerName,
  };
}

/**
 * Форматує ціну для відображення
 */
export function formatPrice(price: number, currency: 'USD' | 'AED' = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : 'AED';
  const safePrice = price || 0;

  if (safePrice >= 1000000) {
    return `${symbol}${(safePrice / 1000000).toFixed(2)}M`;
  }
  // Replace commas with spaces, no decimals
  return `${symbol}${safePrice.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, ' ')}`;
}

/**
 * Конвертує фільтри з UI в формат API
 */
export interface UIFilters {
  listingType: 'all' | 'offplan' | 'secondary';
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: string; // "any" або "1,2,3"
  location: string;
  developerIds: string;
}

export function convertFiltersToAPI(uiFilters: UIFilters): PropertyFilters {
  const apiFilters: PropertyFilters = {};

  // 1. Property type (Listing Type)
  if (uiFilters.listingType === 'offplan') {
    apiFilters.propertyType = 'off-plan';
  } else if (uiFilters.listingType === 'secondary') {
    apiFilters.propertyType = 'secondary';
  }

  // 2. Price range (Direct mapping to minPrice/maxPrice)
  if (uiFilters.minPrice) {
    apiFilters.minPrice = uiFilters.minPrice;
  }
  if (uiFilters.maxPrice) {
    apiFilters.maxPrice = uiFilters.maxPrice;
  }

  // 3. Bedrooms (Keep raw values like 'studio', '1', '2' as backend expects)
  if (uiFilters.bedrooms && uiFilters.bedrooms !== 'any') {
    apiFilters.bedrooms = uiFilters.bedrooms;
  }

  // 5. Locations -> Mapped to 'location' and 'locationId'
  if (uiFilters.location && uiFilters.location !== 'any') {
    const locations = uiFilters.location.split('|').filter(Boolean);
    apiFilters.location = locations;

    // Бекенд тепер підтримує мультиселект через кому
    const allAreUUIDs = locations.every(loc => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(loc));
    if (allAreUUIDs) {
      apiFilters.locationId = locations.join(',');
    } else {
      apiFilters.locationId = locations[0];
    }
  }

  // 6. Developers -> Mapped to 'developerId'
  if ((uiFilters as any).developerIds && (uiFilters as any).developerIds !== 'any') {
    const developers = (uiFilters as any).developerIds.split(',').filter(Boolean);
    // Використовуємо всі вибрані ID через кому
    apiFilters.developerId = developers.join(',');
  }

  console.log('🔄 Converted UI Filters to API:', apiFilters);
  return apiFilters;
}
