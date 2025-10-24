import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { BrokerClientsController } from './broker-clients.controller';
import { LeadsService } from './leads.service';
import { BrokerClientsService } from './broker-clients.service';
import { Lead } from '../database/entities/lead.entity';
import { User } from '../database/entities/user.entity';
import { BrokerClient } from '../database/entities/broker-client.entity';
import { Property } from '../database/entities/property.entity';
import { AmoCrmModule } from '../integrations/amo-crm/amo-crm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, User, BrokerClient, Property]),
    AmoCrmModule,
  ],
  controllers: [LeadsController, BrokerClientsController],
  providers: [LeadsService, BrokerClientsService],
  exports: [LeadsService, BrokerClientsService],
})
export class LeadsModule {}

