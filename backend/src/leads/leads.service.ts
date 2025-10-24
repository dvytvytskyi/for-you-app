import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from '../database/entities/lead.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFiltersDto } from './dto/lead-filters.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createLeadDto: CreateLeadDto, userId?: string): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...createLeadDto,
      clientId: userId || null,
      status: LeadStatus.NEW,
    });

    return this.leadRepository.save(lead);
  }

  async findAll(filters: LeadFiltersDto, user?: User): Promise<{ data: Lead[]; total: number; page: number; limit: number; totalPages: number }> {
    const { page = 1, limit = 10, status, brokerId, clientId, propertyId } = filters;

    const queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.property', 'property')
      .leftJoinAndSelect('lead.client', 'client')
      .leftJoinAndSelect('lead.broker', 'broker');

    // Role-based filtering
    if (user) {
      if (user.role === UserRole.BROKER) {
        // Broker бачить тільки свої заявки або нові (в пулі)
        queryBuilder.where('(lead.brokerId = :userId OR lead.status = :newStatus)', {
          userId: user.id,
          newStatus: LeadStatus.NEW,
        });
      } else if (user.role === UserRole.CLIENT) {
        // Client бачить тільки свої заявки
        queryBuilder.where('lead.clientId = :userId', { userId: user.id });
      }
      // ADMIN бачить все
    }

    // Additional filters
    if (status) {
      queryBuilder.andWhere('lead.status = :status', { status });
    }
    if (brokerId) {
      queryBuilder.andWhere('lead.brokerId = :brokerId', { brokerId });
    }
    if (clientId) {
      queryBuilder.andWhere('lead.clientId = :clientId', { clientId });
    }
    if (propertyId) {
      queryBuilder.andWhere('lead.propertyId = :propertyId', { propertyId });
    }

    // Sorting and pagination
    queryBuilder
      .orderBy('lead.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user?: User): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id },
      relations: ['property', 'client', 'broker'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // Check access rights
    if (user && user.role === UserRole.CLIENT && lead.clientId !== user.id) {
      throw new ForbiddenException('You can only view your own leads');
    }
    if (user && user.role === UserRole.BROKER && lead.brokerId !== user.id && lead.status !== LeadStatus.NEW) {
      throw new ForbiddenException('You can only view your assigned leads or new leads');
    }

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto, user?: User): Promise<Lead> {
    const lead = await this.findOne(id, user);

    // Check if user can update
    if (user) {
      if (user.role === UserRole.CLIENT) {
        throw new ForbiddenException('Clients cannot update leads');
      }
      if (user.role === UserRole.BROKER && lead.brokerId && lead.brokerId !== user.id) {
        throw new ForbiddenException('You can only update your assigned leads');
      }
    }

    Object.assign(lead, updateLeadDto);
    return this.leadRepository.save(lead);
  }

  async assignBroker(leadId: string, brokerId: string): Promise<Lead> {
    const lead = await this.findOne(leadId);
    const broker = await this.userRepository.findOne({ where: { id: brokerId } });

    if (!broker || broker.role !== UserRole.BROKER) {
      throw new NotFoundException('Broker not found or invalid role');
    }

    lead.brokerId = brokerId;
    lead.status = LeadStatus.IN_PROGRESS;

    return this.leadRepository.save(lead);
  }

  async takeLead(leadId: string, brokerId: string): Promise<Lead> {
    const lead = await this.findOne(leadId);

    if (lead.status !== LeadStatus.NEW) {
      throw new ForbiddenException('Only NEW leads can be taken');
    }

    return this.assignBroker(leadId, brokerId);
  }
}

