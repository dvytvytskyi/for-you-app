import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmoCrmService } from './amo-crm.service';
import { AmoCrmController } from './amo-crm.controller';
import { AmoToken } from '../../database/entities/amo-token.entity';
import { AmoPipeline } from '../../database/entities/amo-pipeline.entity';
import { AmoStage } from '../../database/entities/amo-stage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AmoToken, AmoPipeline, AmoStage])],
  controllers: [AmoCrmController],
  providers: [AmoCrmService],
  exports: [AmoCrmService],
})
export class AmoCrmModule {}

