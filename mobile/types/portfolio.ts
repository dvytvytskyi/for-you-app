export enum OperationalStatus {
    UNDER_CONSTRUCTION = 'Under construction',
    WAITING_FOR_RENT_OUT = 'Waiting for rent out',
    RENTING_OUT = 'Renting out',
    PENDING_TO_BE_SOLD = 'Pending to be sold',
    EMPTY = 'Empty',
}

export interface PortfolioItem {
    id: string;
    unitName: string;
    purchasePrice: number;
    annualCashFlow: number;
    estimatedSellingValue: number;
    roi: number;
    appreciation: number;
    operationalStatus: OperationalStatus | string;
    plannedSaleDate: string;
    advisorWhatsapp?: string;
    // New fields for Project Detail view
    size?: string;
    purchaseDate?: string;
    unitType?: string;
    floorPlans?: string[];
    photos?: string[];
    documents?: {
        id?: string;
        name: string;
        description?: string;
        url: string;
    }[];
    property: {
        id: string;
        name: string;
        photos: string[];
        area?: string;
        city?: string;
    };
}

export interface PortfolioAnalytics {
    totalPurchasePrice: number;
    totalAnnualCashFlow: number;
    annualCashFlowIn3Years: number;
    totalEstimatedSellingValue: number;
    totalAppreciationPercentage: number;
    itemCount: number;
}

export interface PortfolioResponse {
    items: PortfolioItem[];
    analytics: PortfolioAnalytics;
}
