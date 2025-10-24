import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../database/entities/favorite.entity';
import { Property } from '../database/entities/property.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {}

  async addToFavorites(userId: string, propertyId: string): Promise<{ message: string }> {
    // Check if property exists
    const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    // Check if already in favorites
    const existing = await this.favoriteRepository.findOne({
      where: { userId, propertyId },
    });

    if (existing) {
      throw new ConflictException('Property is already in favorites');
    }

    // Add to favorites
    const favorite = this.favoriteRepository.create({ userId, propertyId });
    await this.favoriteRepository.save(favorite);

    return { message: 'Property added to favorites' };
  }

  async removeFromFavorites(userId: string, propertyId: string): Promise<{ message: string }> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, propertyId },
    });

    if (!favorite) {
      throw new NotFoundException('Property not found in favorites');
    }

    await this.favoriteRepository.remove(favorite);

    return { message: 'Property removed from favorites' };
  }

  async getUserFavorites(userId: string): Promise<Property[]> {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      relations: ['property', 'property.images', 'property.developer'],
    });

    return favorites.map((fav) => fav.property);
  }

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { userId, propertyId },
    });

    return !!favorite;
  }
}

