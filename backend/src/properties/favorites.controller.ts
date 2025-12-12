import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати улюблені об\'єкти користувача' })
  @ApiResponse({ status: 200, description: 'Список улюблених об\'єктів' })
  async getUserFavorites(@CurrentUser() user: any) {
    return this.favoritesService.getUserFavorites(user.id);
  }

  @Get('ids')
  @ApiOperation({ summary: 'Отримати тільки ID улюблених об\'єктів (для швидкої синхронізації)' })
  @ApiResponse({ status: 200, description: 'Масив ID улюблених об\'єктів' })
  async getFavoriteIds(@CurrentUser() user: any) {
    return this.favoritesService.getFavoriteIds(user.id);
  }

  @Post(':propertyId')
  @ApiOperation({ summary: 'Додати об\'єкт в улюблені' })
  @ApiResponse({ status: 201, description: 'Об\'єкт додано в улюблені' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({ status: 409, description: 'Property already in favorites' })
  async addToFavorites(
    @CurrentUser() user: any,
    @Param('propertyId') propertyId: string,
  ) {
    return this.favoritesService.addToFavorites(user.id, propertyId);
  }

  @Delete(':propertyId')
  @ApiOperation({ summary: 'Видалити об\'єкт з улюблених' })
  @ApiResponse({ status: 200, description: 'Об\'єкт видалено з улюблених' })
  @ApiResponse({ status: 404, description: 'Property not found in favorites' })
  async removeFromFavorites(
    @CurrentUser() user: any,
    @Param('propertyId') propertyId: string,
  ) {
    return this.favoritesService.removeFromFavorites(user.id, propertyId);
  }
}

