import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmoCrmService } from './amo-crm.service';
import { AmoCrmController } from './amo-crm.controller';
import { AmoToken } from '../../database/entities/amo-token.entity';
import { AmoPipeline } from '../../database/entities/amo-pipeline.entity';
import { AmoStage } from '../../database/entities/amo-stage.entity';
import { AmoUser } from '../../database/entities/amo-user.entity';
import { AmoRole } from '../../database/entities/amo-role.entity';
import { AmoContact } from '../../database/entities/amo-contact.entity';
import { Lead } from '../../database/entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AmoToken, AmoPipeline, AmoStage, AmoUser, AmoRole, AmoContact, Lead])],
  controllers: [AmoCrmController],
  providers: [AmoCrmService],
  exports: [AmoCrmService],
})
export class AmoCrmModule {}

