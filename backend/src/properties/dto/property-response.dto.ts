import { ApiProperty } from '@nestjs/swagger';

export class PropertyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  titleEn: string;

  @ApiProperty({ required: false })
  titleRu?: string;

  @ApiProperty({ required: false })
  titleAr?: string;

  @ApiProperty({ required: false })
  descriptionEn?: string;

  @ApiProperty({ required: false })
  logoUrl?: string;

  @ApiProperty({ required: false })
  mainPhotoUrl?: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ type: [String], required: false })
  districts?: string[];

  @ApiProperty({ required: false })
  minPrice?: number;

  @ApiProperty({ required: false })
  maxPrice?: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  isExclusive: boolean;

  @ApiProperty()
  isSoldOut: boolean;

  @ApiProperty({ required: false })
  buildingsCount?: number;

  @ApiProperty({ type: [Object], required: false })
  images?: any[];

  @ApiProperty({ type: [Object], required: false })
  amenities?: any[];

  @ApiProperty({ type: [Object], required: false })
  paymentPlans?: any[];

  @ApiProperty({ type: Object, required: false })
  developer?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedPropertiesResponseDto {
  @ApiProperty({ type: [PropertyResponseDto] })
  data: PropertyResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}

