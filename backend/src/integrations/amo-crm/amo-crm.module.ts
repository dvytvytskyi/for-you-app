import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmoCrmService } from './amo-crm.service';
import { AmoCrmController } from './amo-crm.controller';
import { AmoToken } from '../../database/entities/amo-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AmoToken])],
  controllers: [AmoCrmController],
  providers: [AmoCrmService],
  exports: [AmoCrmService],
})
export class AmoCrmModule {}

