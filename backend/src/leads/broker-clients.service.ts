import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrokerClient } from '../database/entities/broker-client.entity';
import { CreateBrokerClientDto } from './dto/create-broker-client.dto';
import { User, UserRole } from '../database/entities/user.entity';

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

  async findAll(user: User): Promise<BrokerClient[]> {
    const query = this.brokerClientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.broker', 'broker')
      .orderBy('client.createdAt', 'DESC');

    // BROKER бачить тільки своїх клієнтів
    if (user.role === UserRole.BROKER) {
      query.where('client.brokerId = :brokerId', { brokerId: user.id });
    }
    // ADMIN бачить всіх клієнтів всіх брокерів

    return query.getMany();
  }

  async findOne(id: string, user: User): Promise<BrokerClient> {
    const client = await this.brokerClientRepository.findOne({
      where: { id },
      relations: ['broker'],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    // BROKER може бачити тільки своїх клієнтів
    if (user.role === UserRole.BROKER && client.brokerId !== user.id) {
      throw new ForbiddenException('You can only view your own clients');
    }
    // ADMIN може бачити все

    return client;
  }

  async update(id: string, user: User, updateDto: Partial<CreateBrokerClientDto>): Promise<BrokerClient> {
    const client = await this.findOne(id, user);
    Object.assign(client, updateDto);
    return this.brokerClientRepository.save(client);
  }

  async remove(id: string, user: User): Promise<void> {
    const client = await this.findOne(id, user);
    await this.brokerClientRepository.remove(client);
  }
}

