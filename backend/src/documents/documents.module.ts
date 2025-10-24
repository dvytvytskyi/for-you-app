import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from '../database/entities/document.entity';
import { MediaModule } from '../integrations/media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    MediaModule, // Для роботи з S3
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

