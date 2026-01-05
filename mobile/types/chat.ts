export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
    PROJECT = 'PROJECT',
}

export interface ChatMessage {
    id: string;
    content?: string;
    type: MessageType;
    fileUrl?: string;
    fileName?: string;
    propertyId?: string;
    senderId: string;
    createdAt: string;
    sender: {
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };
    property?: {
        id: string;
        name: string;
        photos: string[];
        price?: number;
        priceFrom?: number;
        area: string;
    };
}

export interface SendMessageDto {
    content?: string;
    type: MessageType;
    file?: any; // For multipart/form-data
    propertyId?: string;
}
