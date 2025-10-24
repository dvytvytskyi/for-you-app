import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios, { AxiosInstance } from 'axios';
import { AmoToken } from '../../database/entities/amo-token.entity';
import { AmoPipeline } from '../../database/entities/amo-pipeline.entity';
import { AmoStage } from '../../database/entities/amo-stage.entity';
import { AmoUser } from '../../database/entities/amo-user.entity';
import { AmoRole } from '../../database/entities/amo-role.entity';
import { AmoContact as AmoContactEntity } from '../../database/entities/amo-contact.entity';
import { AmoTask as AmoTaskEntity } from '../../database/entities/amo-task.entity';
import { Lead, LeadStatus } from '../../database/entities/lead.entity';
import {
  AmoAuthResponse,
  AmoLead,
  AmoContact,
  AmoPipeline as IAmoPipeline,
  AmoStatus,
  AmoTask,
} from './interfaces/amo-crm.interface';

@Injectable()
export class AmoCrmService {
  private readonly logger = new Logger(AmoCrmService.name);
  private axiosInstance: AxiosInstance;
  private readonly domain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly accountId: string;
  private readonly apiDomain: string;

  constructor(
    @InjectRepository(AmoToken)
    private readonly amoTokenRepository: Repository<AmoToken>,
    @InjectRepository(AmoPipeline)
    private readonly amoPipelineRepository: Repository<AmoPipeline>,
    @InjectRepository(AmoStage)
    private readonly amoStageRepository: Repository<AmoStage>,
    @InjectRepository(AmoUser)
    private readonly amoUserRepository: Repository<AmoUser>,
    @InjectRepository(AmoRole)
    private readonly amoRoleRepository: Repository<AmoRole>,
    @InjectRepository(AmoContactEntity)
    private readonly amoContactRepository: Repository<AmoContactEntity>,
    @InjectRepository(AmoTaskEntity)
    private readonly amoTaskRepository: Repository<AmoTaskEntity>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    private readonly configService: ConfigService,
  ) {
    this.domain = this.configService.get<string>('AMO_DOMAIN') || '';
    this.clientId = this.configService.get<string>('AMO_CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('AMO_CLIENT_SECRET') || '';
    this.redirectUri = this.configService.get<string>('AMO_REDIRECT_URI') || '';
    this.accountId = this.configService.get<string>('AMO_ACCOUNT_ID') || '';
    this.apiDomain = this.configService.get<string>('AMO_API_DOMAIN') || '';

    // Використовуємо subdomain аккаунта для API запитів
    this.axiosInstance = axios.create({
      baseURL: `https://${this.domain}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Обмін authorization code на токени
   */
  async exchangeCode(code: string): Promise<void> {
    try {
      this.logger.log(`Starting OAuth exchange with domain: ${this.domain}`);
      this.logger.log(`Client ID: ${this.clientId}`);
      this.logger.log(`Redirect URI: ${this.redirectUri}`);
      
      const response = await axios.post<AmoAuthResponse>(
        `https://${this.domain}/oauth2/access_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
        },
      );

      await this.saveTokens(response.data);
      this.logger.log('AMO CRM токени успішно отримані та збережені');
    } catch (error) {
      this.logger.error('Помилка обміну authorization code:', JSON.stringify(error.response?.data || error.message));
      throw new HttpException(
        'Failed to exchange authorization code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Оновлення access token через refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    try {
      const tokenData = await this.amoTokenRepository.findOne({
        where: { accountId: this.accountId },
      });

      if (!tokenData) {
        throw new Error('No tokens found in database');
      }

      const response = await axios.post<AmoAuthResponse>(
        `https://${this.domain}/oauth2/access_token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: tokenData.refreshToken,
          redirect_uri: this.redirectUri,
        },
      );

      await this.saveTokens(response.data);
      this.logger.log('AMO CRM токен оновлено');

      return response.data.access_token;
    } catch (error) {
      this.logger.error('Помилка оновлення токену:', error.response?.data || error.message);
      throw new HttpException('Failed to refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Збереження токенів в БД
   */
  private async saveTokens(authData: AmoAuthResponse): Promise<void> {
    const expiresAt = Date.now() + authData.expires_in * 1000;

    let tokenEntity = await this.amoTokenRepository.findOne({
      where: { accountId: this.accountId },
    });

    if (tokenEntity) {
      tokenEntity.accessToken = authData.access_token;
      tokenEntity.refreshToken = authData.refresh_token;
      tokenEntity.expiresAt = expiresAt;
    } else {
      tokenEntity = this.amoTokenRepository.create({
        accountId: this.accountId,
        accessToken: authData.access_token,
        refreshToken: authData.refresh_token,
        expiresAt,
        baseDomain: this.domain,
      });
    }

    await this.amoTokenRepository.save(tokenEntity);
  }

  /**
   * Ручне збереження токенів (для development)
   */
  async setTokensManually(accessToken: string, refreshToken: string, expiresIn: number = 86400): Promise<void> {
    const expiresAt = Date.now() + expiresIn * 1000;

    let tokenEntity = await this.amoTokenRepository.findOne({
      where: { accountId: this.accountId },
    });

    if (tokenEntity) {
      tokenEntity.accessToken = accessToken;
      tokenEntity.refreshToken = refreshToken;
      tokenEntity.expiresAt = expiresAt;
    } else {
      tokenEntity = this.amoTokenRepository.create({
        accountId: this.accountId,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt,
        baseDomain: this.domain,
      });
    }

    await this.amoTokenRepository.save(tokenEntity);
    this.logger.log('AMO CRM токени вручну збережені в БД');
  }

  /**
   * Отримання валідного access token
   */
  private async getAccessToken(): Promise<string> {
    const tokenData = await this.amoTokenRepository.findOne({
      where: { accountId: this.accountId },
    });

    if (!tokenData) {
      throw new HttpException(
        'No AMO CRM tokens found. Please authorize first.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Перевірка чи токен не протермінувався (з запасом 5 хвилин)
    if (Date.now() > tokenData.expiresAt - 300000) {
      return this.refreshAccessToken();
    }

    return tokenData.accessToken;
  }

  /**
   * Створення Lead в AMO CRM
   */
  async createLead(leadData: Partial<AmoLead>): Promise<number> {
    try {
      const accessToken = await this.getAccessToken();

      this.logger.log('Створення lead в AMO CRM з даними:', JSON.stringify(leadData, null, 2));

      const response = await this.axiosInstance.post(
        '/api/v4/leads',
        [leadData],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const leadId = response.data._embedded.leads[0].id;
      this.logger.log(`Lead створено в AMO CRM: ${leadId}`);

      return leadId;
    } catch (error) {
      this.logger.error('Помилка створення lead в AMO CRM:', JSON.stringify(error.response?.data || error.message, null, 2));
      throw new HttpException(
        'Failed to create lead in AMO CRM',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Оновлення Lead в AMO CRM
   */
  async updateLead(leadId: number, leadData: Partial<AmoLead>): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      await this.axiosInstance.patch(
        '/api/v4/leads',
        [{ id: leadId, ...leadData }],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      this.logger.log(`Lead оновлено в AMO CRM: ${leadId}`);
    } catch (error) {
      this.logger.error('Помилка оновлення lead в AMO CRM:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to update lead in AMO CRM',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Отримання Lead з AMO CRM
   */
  async getLead(leadId: number): Promise<AmoLead> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get(`/api/v4/leads/${leadId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Помилка отримання lead з AMO CRM:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to get lead from AMO CRM',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Форматування Lead для відправки в AMO CRM
   */
  formatLeadForAmo(lead: any, contactId?: number): Partial<AmoLead> {
    // Формуємо назву lead
    let leadName = 'Заявка з сайту';
    if (lead.guestName) {
      leadName = `${lead.guestName}`;
    }
    if (lead.property?.title) {
      leadName += ` - ${lead.property.title}`;
    }

    const amoLead: Partial<AmoLead> = {
      name: leadName,
      price: lead.property?.price || 0,
      // Поки не передаємо custom_fields_values, оскільки не знаємо ID полів
      // TODO: Додати custom_fields_values після налаштування полів в AMO CRM
    };

    if (contactId) {
      amoLead._embedded = {
        contacts: [{ id: contactId }],
      };
    }

    return amoLead;
  }

  /**
   * Обробка webhook подій з AMO CRM
   */
  async processWebhook(payload: any): Promise<{ processed: number; errors: number }> {
    let processed = 0;
    let errors = 0;

    this.logger.log('📥 Обробка webhook з AMO CRM:', JSON.stringify(payload, null, 2));

    // Обробка оновлень статусів leads
    if (payload.leads?.status) {
      for (const statusUpdate of payload.leads.status) {
        try {
          this.logger.log(`Lead ID ${statusUpdate.id} змінив статус на ${statusUpdate.status_id}`);
          
          // Знайти lead в нашій БД за amoLeadId
          const lead = await this.leadRepository.findOne({
            where: { amoLeadId: statusUpdate.id },
          });

          if (lead) {
            // Отримати наш статус на основі AMO stage_id
            const mappedStatus = await this.getOurStatusByAmoStage(statusUpdate.status_id);
            if (mappedStatus) {
              lead.status = mappedStatus;
              await this.leadRepository.save(lead);
              this.logger.log(`✅ Lead ${lead.id} оновлено: новий статус ${mappedStatus}`);
            }
          } else {
            // Якщо lead не існує, імпортуємо його
            const amoLead = await this.getLead(statusUpdate.id);
            await this.importLeadFromAmo(amoLead);
            this.logger.log(`✅ Lead ${statusUpdate.id} імпортовано з AMO CRM`);
          }

          processed++;
        } catch (error) {
          this.logger.error(`Помилка обробки status update для lead ${statusUpdate.id}:`, error.message);
          errors++;
        }
      }
    }

    // Обробка оновлень leads
    if (payload.leads?.update) {
      for (const leadUpdate of payload.leads.update) {
        try {
          this.logger.log(`Lead ID ${leadUpdate.id} оновлено в AMO CRM`);
          
          // Отримати повні дані lead з AMO CRM
          const amoLead = await this.getLead(leadUpdate.id);
          await this.importLeadFromAmo(amoLead);
          this.logger.log(`✅ Lead ${leadUpdate.id} синхронізовано`);

          processed++;
        } catch (error) {
          this.logger.error(`Помилка обробки update для lead ${leadUpdate.id}:`, error.message);
          errors++;
        }
      }
    }

    // Обробка нових leads (створених в AMO CRM)
    if (payload.leads?.add) {
      for (const newLead of payload.leads.add) {
        try {
          this.logger.log(`Новий lead ID ${newLead.id} створено в AMO CRM`);
          
          // Отримати повні дані lead з AMO CRM та імпортувати
          const amoLead = await this.getLead(newLead.id);
          await this.importLeadFromAmo(amoLead);
          this.logger.log(`✅ Новий lead ${newLead.id} імпортовано`);

          processed++;
        } catch (error) {
          this.logger.error(`Помилка обробки нового lead ${newLead.id}:`, error.message);
          errors++;
        }
      }
    }

    // Обробка нових задач (створених в AMO CRM)
    if (payload.tasks?.add) {
      for (const newTask of payload.tasks.add) {
        try {
          this.logger.log(`Нова задача ID ${newTask.id} створена в AMO CRM`);
          
          // Отримати повні дані задачі з AMO CRM та імпортувати
          const amoTask = await this.getTask(newTask.id);
          await this.importTaskFromAmo(amoTask);
          this.logger.log(`✅ Нову задачу ${newTask.id} імпортовано`);

          processed++;
        } catch (error) {
          this.logger.error(`Помилка обробки нової задачі ${newTask.id}:`, error.message);
          errors++;
        }
      }
    }

    // Обробка оновлених задач
    if (payload.tasks?.update) {
      for (const taskUpdate of payload.tasks.update) {
        try {
          this.logger.log(`Задача ID ${taskUpdate.id} оновлена в AMO CRM`);
          
          // Отримати повні дані задачі з AMO CRM
          const amoTask = await this.getTask(taskUpdate.id);
          await this.importTaskFromAmo(amoTask);
          this.logger.log(`✅ Задачу ${taskUpdate.id} синхронізовано`);

          processed++;
        } catch (error) {
          this.logger.error(`Помилка обробки оновлення задачі ${taskUpdate.id}:`, error.message);
          errors++;
        }
      }
    }

    // Обробка видалених задач
    if (payload.tasks?.delete) {
      for (const deletedTask of payload.tasks.delete) {
        try {
          this.logger.log(`Задача ID ${deletedTask.id} видалена в AMO CRM`);
          
          // Видаляємо задачу з нашої БД
          await this.amoTaskRepository.delete({ id: deletedTask.id });
          this.logger.log(`✅ Задачу ${deletedTask.id} видалено`);

          processed++;
        } catch (error) {
          this.logger.error(`Помилка видалення задачі ${deletedTask.id}:`, error.message);
          errors++;
        }
      }
    }

    this.logger.log(`Webhook оброблено: ${processed} успішно, ${errors} помилок`);
    return { processed, errors };
  }

  /**
   * Синхронізація воронок (pipelines) з AMO CRM
   */
  async syncPipelines(): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      // Отримати всі pipelines з AMO CRM
      const response = await this.axiosInstance.get<{ _embedded: { pipelines: IAmoPipeline[] } }>(
        '/api/v4/leads/pipelines',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const pipelines = response.data._embedded?.pipelines || [];
      let synced = 0;
      let errors = 0;

      for (const amoPipeline of pipelines) {
        try {
          // Знайти або створити pipeline в нашій БД
          let pipeline = await this.amoPipelineRepository.findOne({ where: { id: amoPipeline.id } });

          if (pipeline) {
            // Оновити існуючий
            pipeline.name = amoPipeline.name;
            pipeline.sort = amoPipeline.sort;
            pipeline.isMain = amoPipeline.is_main;
            pipeline.isUnsortedOn = amoPipeline.is_unsorted_on;
          } else {
            // Створити новий
            pipeline = this.amoPipelineRepository.create({
              id: amoPipeline.id,
              name: amoPipeline.name,
              sort: amoPipeline.sort,
              isMain: amoPipeline.is_main,
              isUnsortedOn: amoPipeline.is_unsorted_on,
              accountId: this.accountId,
            });
          }

          await this.amoPipelineRepository.save(pipeline);
          synced++;

          // Синхронізувати stages цієї воронки
          if (amoPipeline._embedded?.statuses) {
            await this.syncStages(amoPipeline.id, amoPipeline._embedded.statuses);
          }
        } catch (error) {
          this.logger.error(`Помилка синхронізації pipeline ${amoPipeline.id}:`, error.message);
          errors++;
        }
      }

      this.logger.log(`Синхронізовано ${synced} pipelines, ${errors} помилок`);
      return { synced, errors };
    } catch (error) {
      this.logger.error('Помилка синхронізації pipelines:', error.response?.data || error.message);
      throw new HttpException('Failed to sync pipelines', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Синхронізація етапів (stages) воронки з AMO CRM
   */
  private async syncStages(pipelineId: number, statuses: AmoStatus[]): Promise<void> {
    for (const amoStatus of statuses) {
      try {
        let stage = await this.amoStageRepository.findOne({ where: { id: amoStatus.id } });

        if (stage) {
          // Оновити існуючий
          stage.name = amoStatus.name;
          stage.sort = amoStatus.sort;
          stage.isEditable = amoStatus.is_editable;
          stage.color = amoStatus.color;
        } else {
          // Створити новий
          stage = this.amoStageRepository.create({
            id: amoStatus.id,
            pipelineId: pipelineId,
            name: amoStatus.name,
            sort: amoStatus.sort,
            isEditable: amoStatus.is_editable,
            color: amoStatus.color,
            mappedStatus: null, // Буде налаштовано пізніше
          });
        }

        await this.amoStageRepository.save(stage);
      } catch (error) {
        this.logger.error(`Помилка синхронізації stage ${amoStatus.id}:`, error.message);
      }
    }
  }

  /**
   * Отримати всі pipelines з нашої БД
   */
  async getPipelines(): Promise<AmoPipeline[]> {
    return this.amoPipelineRepository.find({
      relations: ['stages'],
      order: {
        sort: 'ASC',
        stages: {
          sort: 'ASC',
        },
      },
    });
  }

  /**
   * Отримати stages конкретної воронки
   */
  async getStages(pipelineId: number): Promise<AmoStage[]> {
    return this.amoStageRepository.find({
      where: { pipelineId },
      order: { sort: 'ASC' },
    });
  }

  /**
   * Синхронізація ролей з AMO CRM
   */
  async syncRoles(): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get<{ _embedded: { roles: any[] } }>(
        '/api/v4/roles',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 250,
          },
        },
      );

      const amoRoles = response.data._embedded?.roles || [];
      let synced = 0;
      let errors = 0;

      for (const amoRole of amoRoles) {
        try {
          let role = await this.amoRoleRepository.findOne({ where: { id: amoRole.id } });

          if (role) {
            role.name = amoRole.name;
            role.rights = amoRole.rights;
          } else {
            role = this.amoRoleRepository.create({
              id: amoRole.id,
              name: amoRole.name,
              rights: amoRole.rights,
              accountId: this.accountId,
            });
          }

          await this.amoRoleRepository.save(role);
          synced++;
        } catch (error) {
          this.logger.error(`Помилка синхронізації role ${amoRole.id}:`, error.message);
          errors++;
        }
      }

      this.logger.log(`Синхронізовано ${synced} ролей, ${errors} помилок`);
      return { synced, errors };
    } catch (error) {
      this.logger.error('Помилка синхронізації roles:', error.response?.data || error.message);
      throw new HttpException('Failed to sync roles', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Синхронізація користувачів з AMO CRM
   */
  async syncUsers(): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get<{ _embedded: { users: any[] } }>(
        '/api/v4/users',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit: 250,
            with: 'role',
          },
        },
      );

      const amoUsers = response.data._embedded?.users || [];
      let synced = 0;
      let errors = 0;

      for (const amoUser of amoUsers) {
        try {
          let user = await this.amoUserRepository.findOne({ where: { id: amoUser.id } });

          if (user) {
            user.name = amoUser.name;
            user.email = amoUser.email;
            user.lang = amoUser.lang;
            user.isAdmin = amoUser.rights?.is_admin || false;
            user.isFree = amoUser.rights?.is_free || false;
            user.isActive = amoUser.rights?.is_active || true;
            user.roleId = amoUser.rights?.role_id || null;
            user.groupId = amoUser.rights?.group_id || null;
          } else {
            user = this.amoUserRepository.create({
              id: amoUser.id,
              name: amoUser.name,
              email: amoUser.email,
              lang: amoUser.lang,
              isAdmin: amoUser.rights?.is_admin || false,
              isFree: amoUser.rights?.is_free || false,
              isActive: amoUser.rights?.is_active || true,
              roleId: amoUser.rights?.role_id || null,
              groupId: amoUser.rights?.group_id || null,
              accountId: this.accountId,
            });
          }

          await this.amoUserRepository.save(user);
          synced++;
        } catch (error) {
          this.logger.error(`Помилка синхронізації user ${amoUser.id}:`, error.message);
          errors++;
        }
      }

      this.logger.log(`Синхронізовано ${synced} користувачів, ${errors} помилок`);
      return { synced, errors };
    } catch (error) {
      this.logger.error('Помилка синхронізації users:', error.response?.data || error.message);
      throw new HttpException('Failed to sync users', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Отримати користувачів з БД
   */
  async getUsers(): Promise<AmoUser[]> {
    return this.amoUserRepository.find({
      relations: ['role'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Отримати ролі з БД
   */
  async getRoles(): Promise<AmoRole[]> {
    return this.amoRoleRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Синхронізація контактів з AMO CRM
   */
  async syncContacts(limit: number = 50): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get<{ _embedded: { contacts: AmoContact[] } }>(
        '/api/v4/contacts',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit,
            order: {
              updated_at: 'desc',
            },
          },
        },
      );

      const amoContacts = response.data._embedded?.contacts || [];
      let synced = 0;
      let errors = 0;

      for (const amoContact of amoContacts) {
        try {
          await this.importContactFromAmo(amoContact);
          synced++;
        } catch (error) {
          this.logger.error(`Помилка імпорту contact ${amoContact.id}:`, error.message);
          errors++;
        }
      }

      this.logger.log(`Синхронізовано ${synced} контактів з AMO CRM, ${errors} помилок`);
      return { synced, errors };
    } catch (error) {
      this.logger.error('Помилка синхронізації contacts з AMO CRM:', error.response?.data || error.message);
      throw new HttpException('Failed to sync contacts from AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Імпорт одного контакту з AMO CRM в нашу БД
   */
  private async importContactFromAmo(amoContact: AmoContact): Promise<AmoContactEntity> {
    let contact = await this.amoContactRepository.findOne({
      where: { id: amoContact.id },
    });

    // Витягуємо email та телефон з custom_fields_values
    let email: string | null = null;
    let phone: string | null = null;

    if (amoContact.custom_fields_values) {
      for (const field of amoContact.custom_fields_values) {
        if (field.field_code === 'EMAIL' && field.values && field.values.length > 0) {
          email = String(field.values[0].value);
        }
        if (field.field_code === 'PHONE' && field.values && field.values.length > 0) {
          phone = String(field.values[0].value);
        }
      }
    }

    if (contact) {
      // Оновити існуючий контакт
      contact.name = amoContact.name;
      if (amoContact.first_name) contact.firstName = amoContact.first_name;
      if (amoContact.last_name) contact.lastName = amoContact.last_name;
      if (email) contact.email = email;
      if (phone) contact.phone = phone;
      if (amoContact.responsible_user_id) contact.responsibleUserId = amoContact.responsible_user_id;
      if (amoContact.created_at) contact.amoCreatedAt = amoContact.created_at;
      if (amoContact.updated_at) contact.amoUpdatedAt = amoContact.updated_at;
    } else {
      // Створити новий контакт
      contact = new AmoContactEntity();
      if (amoContact.id) contact.id = amoContact.id;
      contact.name = amoContact.name;
      if (amoContact.first_name) contact.firstName = amoContact.first_name;
      if (amoContact.last_name) contact.lastName = amoContact.last_name;
      if (email) contact.email = email;
      if (phone) contact.phone = phone;
      if (amoContact.responsible_user_id) contact.responsibleUserId = amoContact.responsible_user_id;
      if (amoContact.created_at) contact.amoCreatedAt = amoContact.created_at;
      if (amoContact.updated_at) contact.amoUpdatedAt = amoContact.updated_at;
      contact.accountId = this.accountId;
    }

    await this.amoContactRepository.save(contact);
    this.logger.debug(`Contact ${amoContact.id} імпортовано/оновлено (${contact.name})`);

    return contact;
  }

  /**
   * Створити контакт в AMO CRM
   */
  async createContact(contactData: {
    name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    responsible_user_id?: number;
  }): Promise<number> {
    try {
      const accessToken = await this.getAccessToken();

      const customFields: any[] = [];

      if (contactData.email) {
        customFields.push({
          field_code: 'EMAIL',
          values: [
            {
              value: contactData.email,
              enum_code: 'WORK',
            },
          ],
        });
      }

      if (contactData.phone) {
        customFields.push({
          field_code: 'PHONE',
          values: [
            {
              value: contactData.phone,
              enum_code: 'WORK',
            },
          ],
        });
      }

      const amoContact: AmoContact = {
        name: contactData.name || `${contactData.first_name || ''} ${contactData.last_name || ''}`.trim() || 'Контакт',
        first_name: contactData.first_name,
        last_name: contactData.last_name,
        responsible_user_id: contactData.responsible_user_id,
      };

      if (customFields.length > 0) {
        amoContact.custom_fields_values = customFields;
      }

      const response = await this.axiosInstance.post<{ _embedded: { contacts: Array<{ id: number }> } }>(
        '/api/v4/contacts',
        [amoContact],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdContactId = response.data._embedded.contacts[0].id;
      this.logger.log(`Контакт створено в AMO CRM з ID: ${createdContactId}`);

      // Імпортуємо створений контакт в нашу БД
      const fullContact = await this.getContact(createdContactId);
      await this.importContactFromAmo(fullContact);

      return createdContactId;
    } catch (error) {
      this.logger.error('Помилка створення контакту в AMO CRM:', error.response?.data || error.message);
      throw new HttpException('Failed to create contact in AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Отримати контакт з AMO CRM по ID
   */
  async getContact(contactId: number): Promise<AmoContact> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get<AmoContact>(
        `/api/v4/contacts/${contactId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Помилка отримання контакту ${contactId}:`, error.response?.data || error.message);
      throw new HttpException('Failed to get contact from AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Отримати контакти з БД
   */
  async getContacts(): Promise<AmoContactEntity[]> {
    return this.amoContactRepository.find({
      relations: ['responsibleUser'],
      order: { name: 'ASC' },
    });
  }

  /**
   * ========================================
   * TASKS METHODS
   * ========================================
   */

  /**
   * Синхронізація задач з AMO CRM
   */
  async syncTasks(filters?: {
    responsible_user_id?: number;
    is_completed?: boolean;
    entity_type?: string;
    entity_id?: number;
    limit?: number;
  }): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      const params: any = {
        limit: filters?.limit || 50,
      };

      if (filters?.responsible_user_id) {
        params['filter[responsible_user_id]'] = filters.responsible_user_id;
      }
      if (filters?.is_completed !== undefined) {
        params['filter[is_completed]'] = filters.is_completed ? 1 : 0;
      }
      if (filters?.entity_type) {
        params['filter[entity_type]'] = filters.entity_type;
      }
      if (filters?.entity_id) {
        params['filter[entity_id]'] = filters.entity_id;
      }

      const response = await this.axiosInstance.get<{ _embedded: { tasks: AmoTask[] } }>(
        '/api/v4/tasks',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params,
        },
      );

      const amoTasks = response.data._embedded?.tasks || [];
      let synced = 0;
      let errors = 0;

      for (const amoTask of amoTasks) {
        try {
          await this.importTaskFromAmo(amoTask);
          synced++;
        } catch (error) {
          this.logger.error(`Помилка імпорту task ${amoTask.id}:`, error.message);
          errors++;
        }
      }

      this.logger.log(`Синхронізовано ${synced} задач з AMO CRM, ${errors} помилок`);
      return { synced, errors };
    } catch (error) {
      this.logger.error('Помилка синхронізації tasks з AMO CRM:', error.response?.data || error.message);
      throw new HttpException('Failed to sync tasks from AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Імпорт однієї задачі з AMO CRM в нашу БД
   */
  private async importTaskFromAmo(amoTask: AmoTask): Promise<AmoTaskEntity> {
    let task = await this.amoTaskRepository.findOne({
      where: { id: amoTask.id },
    });

    if (task) {
      // Оновити існуючу задачу
      task.text = amoTask.text;
      task.taskTypeId = amoTask.task_type_id || 1;
      task.completeTill = amoTask.complete_till;
      task.isCompleted = amoTask.is_completed || false;
      if (amoTask.responsible_user_id) task.responsibleUserId = amoTask.responsible_user_id;
      if (amoTask.entity_id) task.entityId = amoTask.entity_id;
      if (amoTask.entity_type) task.entityType = amoTask.entity_type;
      if (amoTask.duration) task.duration = amoTask.duration;
      if (amoTask.result?.text) task.resultText = amoTask.result.text;
      if (amoTask.created_by) task.createdBy = amoTask.created_by;
      if (amoTask.updated_by) task.updatedBy = amoTask.updated_by;
      if (amoTask.created_at) task.amoCreatedAt = amoTask.created_at;
      if (amoTask.updated_at) task.amoUpdatedAt = amoTask.updated_at;
    } else {
      // Створити нову задачу
      task = this.amoTaskRepository.create({
        text: amoTask.text,
        taskTypeId: amoTask.task_type_id || 1,
        completeTill: amoTask.complete_till,
        isCompleted: amoTask.is_completed || false,
        responsibleUserId: amoTask.responsible_user_id,
        entityId: amoTask.entity_id,
        entityType: amoTask.entity_type,
        duration: amoTask.duration,
        resultText: amoTask.result?.text,
        createdBy: amoTask.created_by,
        updatedBy: amoTask.updated_by,
        amoCreatedAt: amoTask.created_at,
        amoUpdatedAt: amoTask.updated_at,
        accountId: this.accountId,
      });
      if (amoTask.id) task.id = amoTask.id; // Встановлюємо AMO CRM ID
    }

    await this.amoTaskRepository.save(task);
    this.logger.debug(`Task ${amoTask.id} імпортовано/оновлено (${task.text})`);

    return task;
  }

  /**
   * Створити задачу в AMO CRM
   */
  async createTask(taskData: {
    text: string;
    complete_till: number;
    task_type_id?: number;
    responsible_user_id?: number;
    entity_id?: number;
    entity_type?: string;
  }): Promise<number> {
    try {
      const accessToken = await this.getAccessToken();

      const amoTask: AmoTask = {
        text: taskData.text,
        complete_till: taskData.complete_till,
        task_type_id: taskData.task_type_id || 1, // 1 - дзвінок
        responsible_user_id: taskData.responsible_user_id,
        entity_id: taskData.entity_id,
        entity_type: taskData.entity_type,
      };

      const response = await this.axiosInstance.post<{ _embedded: { tasks: Array<{ id: number }> } }>(
        '/api/v4/tasks',
        [amoTask],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const createdTaskId = response.data._embedded.tasks[0].id;
      this.logger.log(`Задачу створено в AMO CRM з ID: ${createdTaskId}`);

      // Імпортуємо створену задачу в нашу БД
      const fullTask = await this.getTask(createdTaskId);
      await this.importTaskFromAmo(fullTask);

      return createdTaskId;
    } catch (error) {
      this.logger.error('Помилка створення задачі в AMO CRM:', error.response?.data || error.message);
      throw new HttpException('Failed to create task in AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Оновити задачу в AMO CRM
   */
  async updateTask(taskId: number, taskData: Partial<AmoTask>): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      await this.axiosInstance.patch(
        '/api/v4/tasks',
        [{ id: taskId, ...taskData }],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Задачу ${taskId} оновлено в AMO CRM`);

      // Оновлюємо в нашій БД
      const fullTask = await this.getTask(taskId);
      await this.importTaskFromAmo(fullTask);
    } catch (error) {
      this.logger.error(`Помилка оновлення задачі ${taskId} в AMO CRM:`, error.response?.data || error.message);
      throw new HttpException('Failed to update task in AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Виконати задачу
   */
  async completeTask(taskId: number, resultText?: string): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      const updateData: any = {
        id: taskId,
        is_completed: true,
      };

      if (resultText) {
        updateData.result = {
          text: resultText,
        };
      }

      await this.axiosInstance.patch(
        `/api/v4/tasks/${taskId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(`Задачу ${taskId} виконано в AMO CRM`);

      // Оновлюємо в нашій БД
      const fullTask = await this.getTask(taskId);
      await this.importTaskFromAmo(fullTask);
    } catch (error) {
      this.logger.error(`Помилка виконання задачі ${taskId} в AMO CRM:`, error.response?.data || error.message);
      throw new HttpException('Failed to complete task in AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Отримати задачу з AMO CRM по ID
   */
  async getTask(taskId: number): Promise<AmoTask> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.get<AmoTask>(
        `/api/v4/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Помилка отримання задачі ${taskId}:`, error.response?.data || error.message);
      throw new HttpException('Failed to get task from AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Отримати задачі з БД
   */
  async getTasks(filters?: {
    responsible_user_id?: number;
    is_completed?: boolean;
    entity_type?: string;
    entity_id?: number;
  }): Promise<AmoTaskEntity[]> {
    const where: any = {};

    if (filters?.responsible_user_id) {
      where.responsibleUserId = filters.responsible_user_id;
    }
    if (filters?.is_completed !== undefined) {
      where.isCompleted = filters.is_completed;
    }
    if (filters?.entity_type) {
      where.entityType = filters.entity_type;
    }
    if (filters?.entity_id) {
      where.entityId = filters.entity_id;
    }

    return this.amoTaskRepository.find({
      where: Object.keys(where).length > 0 ? where : undefined,
      relations: ['responsibleUser'],
      order: { completeTill: 'ASC' },
    });
  }

  /**
   * ========================================
   * CRON JOBS
   * ========================================
   */

  /**
   * CRON job для автоматичної синхронізації pipelines кожні 6 годин
   */
  @Cron(CronExpression.EVERY_6_HOURS)
  async handlePipelinesSyncCron() {
    this.logger.log('⏰ Запуск автоматичної синхронізації pipelines...');
    try {
      const result = await this.syncPipelines();
      this.logger.log(`✅ Автоматична синхронізація pipelines завершена: ${result.synced} синхронізовано, ${result.errors} помилок`);
    } catch (error) {
      this.logger.error('❌ Помилка автоматичної синхронізації pipelines:', error.message);
    }
  }

  /**
   * CRON job для синхронізації leads кожні 30 хвилин
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async handleLeadsSyncCron() {
    this.logger.log('⏰ Запуск автоматичної синхронізації leads...');
    try {
      const result = await this.syncLeadsFromAmo();
      this.logger.log(`✅ Автоматична синхронізація leads завершена: ${result.synced} синхронізовано, ${result.errors} помилок`);
    } catch (error) {
      this.logger.error('❌ Помилка автоматичної синхронізації leads:', error.message);
    }
  }

  /**
   * Синхронізація leads з AMO CRM в нашу БД
   */
  async syncLeadsFromAmo(limit: number = 50): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      // Отримати leads з AMO CRM
      const response = await this.axiosInstance.get<{ _embedded: { leads: AmoLead[] } }>(
        '/api/v4/leads',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit,
            order: {
              updated_at: 'desc',
            },
          },
        },
      );

      const amoLeads = response.data._embedded?.leads || [];
      let synced = 0;
      let errors = 0;

      for (const amoLead of amoLeads) {
        try {
          this.logger.debug(`AMO Lead data: id=${amoLead.id}, responsible=${amoLead.responsible_user_id}, status=${amoLead.status_id}`);
          await this.importLeadFromAmo(amoLead);
          synced++;
        } catch (error) {
          this.logger.error(`Помилка імпорту lead ${amoLead.id}:`, error.message);
          errors++;
        }
      }

      this.logger.log(`Синхронізовано ${synced} leads з AMO CRM, ${errors} помилок`);
      return { synced, errors };
    } catch (error) {
      this.logger.error('Помилка синхронізації leads з AMO CRM:', error.response?.data || error.message);
      throw new HttpException('Failed to sync leads from AMO CRM', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Імпорт одного lead з AMO CRM в нашу БД
   */
  private async importLeadFromAmo(amoLead: AmoLead): Promise<Lead> {
    // Перевірити чи вже існує lead з таким amoLeadId
    let lead = await this.leadRepository.findOne({
      where: { amoLeadId: amoLead.id },
    });

    // Отримати наш статус на основі AMO stage_id
    let ourStatus = LeadStatus.NEW;
    if (amoLead.status_id) {
      const mappedStatus = await this.getOurStatusByAmoStage(amoLead.status_id);
      if (mappedStatus) {
        ourStatus = mappedStatus;
      }
    }

    if (lead) {
      // Оновити існуючий lead
      lead.status = ourStatus;
      lead.guestName = amoLead.name || lead.guestName;
      if (amoLead.responsible_user_id) lead.responsibleUserId = amoLead.responsible_user_id;
      // Не перезаписуємо інші поля, якщо вони вже заповнені
    } else {
      // Створити новий lead
      lead = this.leadRepository.create({
        guestName: amoLead.name || 'Lead з AMO CRM',
        status: ourStatus,
        responsibleUserId: amoLead.responsible_user_id,
        // Інші поля будуть undefined, оскільки в AMO CRM може не бути цих даних
      });
      if (amoLead.id) lead.amoLeadId = amoLead.id; // Встановлюємо AMO CRM ID
    }

    await this.leadRepository.save(lead);
    this.logger.debug(`Lead ${amoLead.id} імпортовано/оновлено (responsible: ${lead.responsibleUserId})`);
    
    return lead;
  }

  /**
   * Оновити мапінг статусу для етапу AMO CRM
   */
  async updateStageMapping(stageId: number, mappedStatus: LeadStatus | null): Promise<AmoStage> {
    const stage = await this.amoStageRepository.findOne({ where: { id: stageId } });

    if (!stage) {
      throw new HttpException(`Stage with ID ${stageId} not found`, HttpStatus.NOT_FOUND);
    }

    stage.mappedStatus = mappedStatus;
    await this.amoStageRepository.save(stage);

    this.logger.log(`Мапінг оновлено: Stage ${stageId} → ${mappedStatus || 'null'}`);
    return stage;
  }

  /**
   * Отримати наш статус по AMO stage ID
   */
  async getOurStatusByAmoStage(stageId: number): Promise<LeadStatus | null> {
    const stage = await this.amoStageRepository.findOne({ 
      where: { id: stageId },
      select: ['mappedStatus'],
    });

    return stage?.mappedStatus || null;
  }

  /**
   * Отримати AMO stage ID по нашому статусу
   */
  async getAmoStageByOurStatus(status: LeadStatus, pipelineId?: number): Promise<number | null> {
    const where: any = { mappedStatus: status };
    if (pipelineId) {
      where.pipelineId = pipelineId;
    }

    const stage = await this.amoStageRepository.findOne({ 
      where,
      select: ['id'],
    });

    return stage?.id || null;
  }

  /**
   * Отримати рекомендації по автоматичному мапінгу
   */
  async getSuggestedMappings(): Promise<Array<{ stageId: number; stageName: string; suggestedStatus: LeadStatus | null; reason: string }>> {
    const stages = await this.amoStageRepository.find({
      where: { mappedStatus: null as any },
      relations: ['pipeline'],
    });

    const suggestions: Array<{ stageId: number; stageName: string; suggestedStatus: LeadStatus | null; reason: string }> = [];

    for (const stage of stages) {
      const nameLower = stage.name.toLowerCase();
      let suggestedStatus: LeadStatus | null = null;
      let reason = '';

      // Логіка автоматичного визначення статусу за назвою
      if (nameLower.includes('неразобран') || nameLower.includes('unsorted')) {
        suggestedStatus = LeadStatus.NEW;
        reason = 'Етап "Неразобранное" зазвичай відповідає новим лідам';
      } else if (nameLower.includes('нов') || nameLower.includes('new') || nameLower.includes('заявка')) {
        suggestedStatus = LeadStatus.NEW;
        reason = 'Назва містить слова "новий" або "заявка"';
      } else if (nameLower.includes('работ') || nameLower.includes('progress') || nameLower.includes('квал') || nameLower.includes('презент') || nameLower.includes('показ')) {
        suggestedStatus = LeadStatus.IN_PROGRESS;
        reason = 'Етап активної роботи з лідом';
      } else if (nameLower.includes('won') || nameLower.includes('успешн') || nameLower.includes('документы подписаны') || nameLower.includes('закрыт') || nameLower.includes('post sales')) {
        suggestedStatus = LeadStatus.CLOSED;
        reason = 'Етап успішного завершення угоди';
      } else if (nameLower.includes('lost') || nameLower.includes('отказ') || nameLower.includes('холодн')) {
        suggestedStatus = LeadStatus.CLOSED;
        reason = 'Етап закриття (відмова або холодний лід)';
      }

      if (suggestedStatus) {
        suggestions.push({
          stageId: stage.id,
          stageName: stage.name,
          suggestedStatus,
          reason,
        });
      }
    }

    return suggestions;
  }

  /**
   * Застосувати автоматичний мапінг на основі рекомендацій
   */
  async applyAutoMapping(): Promise<{ updated: number; skipped: number }> {
    const suggestions = await this.getSuggestedMappings();
    let updated = 0;
    let skipped = 0;

    for (const suggestion of suggestions) {
      try {
        await this.updateStageMapping(suggestion.stageId, suggestion.suggestedStatus);
        updated++;
      } catch (error) {
        this.logger.error(`Помилка застосування мапінгу для stage ${suggestion.stageId}:`, error.message);
        skipped++;
      }
    }

    this.logger.log(`Автоматичний мапінг: ${updated} оновлено, ${skipped} пропущено`);
    return { updated, skipped };
  }
}

