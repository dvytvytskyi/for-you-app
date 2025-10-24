import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerClient } from '../database/entities/broker-client.entity';
import { CreateBrokerClientDto } from './dto/create-broker-client.dto';

@Injectable()
export class BrokerClientsService {
  constructor(
    @InjectRepository(BrokerClient)
    private readonly brokerClientRepository: Repository<BrokerClient>,
  ) {}

  async create(brokerId: string, createDto: CreateBrokerClientDto): Promise<BrokerClient> {
    const brokerClient = this.brokerClientRepository.create({
      ...createDto,
      brokerId,
    });

    return this.brokerClientRepository.save(brokerClient);
  }

  async findAll(brokerId: string): Promise<BrokerClient[]> {
    return this.brokerClientRepository.find({
      where: { brokerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, brokerId: string): Promise<BrokerClient> {
    const client = await this.brokerClientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    if (client.brokerId !== brokerId) {
      throw new ForbiddenException('You can only view your own clients');
    }

    return client;
  }

  async update(id: string, brokerId: string, updateDto: Partial<CreateBrokerClientDto>): Promise<BrokerClient> {
    const client = await this.findOne(id, brokerId);
    Object.assign(client, updateDto);
    return this.brokerClientRepository.save(client);
  }

  async remove(id: string, brokerId: string): Promise<void> {
    const client = await this.findOne(id, brokerId);
    await this.brokerClientRepository.remove(client);
  }
}

