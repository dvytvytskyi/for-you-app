export interface ProjectDocument {
    id: string;
    title: string;
    description: string;
    fileUrl: string;
}

export interface ProjectPurchasedUnit {
    unitId: string;
    unitType: string;
    size: string;
    purchaseDate: string;
    floorPlans: string[];
    projectPhotos: string[];
    unitPhotos?: string[];
    documents: ProjectDocument[];
}

export interface ProjectArea {
    name: string;
    description: string;
    photos: string[];
}

export interface ProjectData {
    id: string;
    name: string;
    location: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    // Stats & Financials
    bedrooms: string | number;
    bathrooms: string | number;
    size: string | number;
    sizeUnit: string;
    completion: string;

    financials: {
        totalPurchase: string;
        estSalePrice: string;
        annualCashFlow: string;
        avgAppreciation: string;
        rentEst3Years: string;
    };

    gallery: string[];
    description: string;
    purchasedUnit: ProjectPurchasedUnit;
    area: ProjectArea;
}

export interface ProjectResponse {
    success: boolean;
    data: ProjectData;
}
