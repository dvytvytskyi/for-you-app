import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSyncService } from './data-sync.service';
import { DataSyncController } from './data-sync.controller';
import { Property } from '../../database/entities/property.entity';
import { PropertyImage } from '../../database/entities/property-image.entity';
import { Developer } from '../../database/entities/developer.entity';
import { SyncLog } from '../../database/entities/sync-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyImage, Developer, SyncLog]),
  ],
  controllers: [DataSyncController],
  providers: [DataSyncService],
  exports: [DataSyncService],
})
export class DataSyncModule {}

