import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { Property } from '../database/entities/property.entity';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { PaginatedPropertiesResponseDto } from './dto/property-response.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async findAll(filters: PropertyFiltersDto): Promise<PaginatedPropertiesResponseDto> {
    const { page = 1, limit = 10, search, type, minPrice, maxPrice, isExclusive, districts, sort, latitude, longitude, radius } = filters;

    const queryBuilder = this.propertyRepository
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.images', 'images')
      .leftJoinAndSelect('property.amenities', 'amenities')
      .leftJoinAndSelect('property.paymentPlans', 'paymentPlans')
      .leftJoinAndSelect('property.developer', 'developer')
      .where('property.isArchived = :isArchived', { isArchived: false });

    // Text search
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(property.titleEn) LIKE LOWER(:search)', { search: `%${search}%` })
            .orWhere('LOWER(property.titleRu) LIKE LOWER(:search)', { search: `%${search}%` })
            .orWhere('LOWER(property.titleAr) LIKE LOWER(:search)', { search: `%${search}%` })
            .orWhere('LOWER(property.address) LIKE LOWER(:search)', { search: `%${search}%` });
        }),
      );
    }

    // Type filter
    if (type && type.length > 0) {
      queryBuilder.andWhere('property.type IN (:...types)', { types: type });
    }

    // Price filter
    if (minPrice !== undefined) {
      queryBuilder.andWhere('property.minPrice >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('property.maxPrice <= :maxPrice', { maxPrice });
    }

    // Exclusive filter
    if (isExclusive !== undefined) {
      queryBuilder.andWhere('property.isExclusive = :isExclusive', { isExclusive });
    }

    // Districts filter
    if (districts && districts.length > 0) {
      queryBuilder.andWhere('property.districts && :districts', { districts });
    }

    // Geo search using PostGIS
    if (latitude !== undefined && longitude !== undefined && radius !== undefined) {
      queryBuilder.andWhere(
        `ST_DWithin(
          property.location::geography,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          :radius
        )`,
        { latitude, longitude, radius },
      );
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        queryBuilder.orderBy('property.minPrice', 'ASC', 'NULLS LAST');
        break;
      case 'price_desc':
        queryBuilder.orderBy('property.maxPrice', 'DESC', 'NULLS LAST');
        break;
      case 'created_asc':
        queryBuilder.orderBy('property.createdAt', 'ASC');
        break;
      case 'created_desc':
      default:
        queryBuilder.orderBy('property.createdAt', 'DESC');
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute
    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['images', 'amenities', 'paymentPlans', 'developer'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findExclusive(filters: PropertyFiltersDto): Promise<PaginatedPropertiesResponseDto> {
    return this.findAll({ ...filters, isExclusive: true });
  }
}

