import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { FavoritesController } from './favorites.controller';
import { PropertiesService } from './properties.service';
import { FavoritesService } from './favorites.service';
import { Property } from '../database/entities/property.entity';
import { PropertyImage } from '../database/entities/property-image.entity';
import { PropertyAmenity } from '../database/entities/property-amenity.entity';
import { PaymentPlan } from '../database/entities/payment-plan.entity';
import { Developer } from '../database/entities/developer.entity';
import { Favorite } from '../database/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Property,
      PropertyImage,
      PropertyAmenity,
      PaymentPlan,
      Developer,
      Favorite,
    ]),
  ],
  controllers: [PropertiesController, FavoritesController],
  providers: [PropertiesService, FavoritesService],
  exports: [PropertiesService, FavoritesService],
})
export class PropertiesModule {}

