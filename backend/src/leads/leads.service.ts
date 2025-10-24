import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead, LeadStatus } from '../database/entities/lead.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { Property } from '../database/entities/property.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFiltersDto } from './dto/lead-filters.dto';
import { AmoCrmService } from '../integrations/amo-crm/amo-crm.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly amoCrmService: AmoCrmService,
  ) {}

  async create(createLeadDto: CreateLeadDto, userId?: string): Promise<Lead> {
    const { propertyId, ...rest } = createLeadDto;

    const lead = this.leadRepository.create({
      ...rest,
      clientId: userId || undefined,
      status: LeadStatus.NEW,
    });

    // Додаємо property якщо вказано
    if (propertyId) {
      const property = await this.propertyRepository.findOne({ where: { id: propertyId } });
      if (!property) {
        throw new NotFoundException(`Property with ID ${propertyId} not found`);
      }
      lead.property = property;
    }

    const savedLead = await this.leadRepository.save(lead);

    // 🔥 Синхронізація з AMO CRM
    try {
      // 1. Спочатку створюємо контакт в AMO CRM
      const amoContactId = await this.amoCrmService.createContact({
        name: savedLead.guestName,
        email: savedLead.guestEmail,
        phone: savedLead.guestPhone,
      });

      // 2. Створюємо lead з прив'язкою до контакту
      const amoLeadData = this.amoCrmService.formatLeadForAmo(savedLead, amoContactId);
      const amoLeadId = await this.amoCrmService.createLead(amoLeadData);
      
      // 3. Зберігаємо AMO ID для майбутньої синхронізації
      savedLead.amoLeadId = amoLeadId;
      savedLead.amoContactId = amoContactId;
      await this.leadRepository.save(savedLead);
      
      // 4. Автоматично створюємо задачу "Зателефонувати клієнту" (через 1 годину)
      try {
        const taskDeadline = Math.floor(Date.now() / 1000) + 3600; // +1 година
        await this.amoCrmService.createTask({
          text: `Зателефонувати клієнту: ${savedLead.guestName}`,
          complete_till: taskDeadline,
          task_type_id: 1, // 1 - дзвінок
          entity_id: amoLeadId,
          entity_type: 'leads',
        });
        this.logger.log(`Задача створена для Lead ${savedLead.id}`);
      } catch (taskError) {
        this.logger.error(`Помилка створення задачі для Lead ${savedLead.id}:`, taskError.message);
      }
      
      this.logger.log(`Lead ${savedLead.id} синхронізовано з AMO CRM (Lead ID: ${amoLeadId}, Contact ID: ${amoContactId})`);
    } catch (error) {
      // Не блокуємо створення lead при помилці синхронізації
      this.logger.error(`Помилка синхронізації Lead ${savedLead.id} з AMO CRM:`, error.message);
    }

    return savedLead;
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
      }
      // ADMIN бачить все
      // CLIENT не має доступу до списку leads
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
    if (user && user.role === UserRole.BROKER && lead.brokerId !== user.id && lead.status !== LeadStatus.NEW) {
      throw new ForbiddenException('You can only view your assigned leads or new leads');
    }
    // CLIENT не має доступу до перегляду leads

    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto, user?: User): Promise<Lead> {
    const lead = await this.findOne(id, user);

    // Check if user can update
    if (user) {
      if (user.role === UserRole.BROKER && lead.brokerId && lead.brokerId !== user.id) {
        throw new ForbiddenException('You can only update your assigned leads');
      }
    }

    Object.assign(lead, updateLeadDto);
    const updatedLead = await this.leadRepository.save(lead);

    // 🔥 Синхронізація з AMO CRM при оновленні статусу
    if (updatedLead.amoLeadId && updateLeadDto.status) {
      try {
        const amoLeadData = this.amoCrmService.formatLeadForAmo(updatedLead);
        await this.amoCrmService.updateLead(updatedLead.amoLeadId, amoLeadData);
        this.logger.log(`Lead ${updatedLead.id} оновлено в AMO CRM (AMO ID: ${updatedLead.amoLeadId})`);
      } catch (error) {
        this.logger.error(`Помилка оновлення Lead ${updatedLead.id} в AMO CRM:`, error.message);
      }
    }

    return updatedLead;
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

