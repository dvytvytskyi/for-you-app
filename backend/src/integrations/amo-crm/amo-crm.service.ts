import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AmoToken } from '../../database/entities/amo-token.entity';
import {
  AmoAuthResponse,
  AmoLead,
  AmoContact,
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
   * Створення Contact в AMO CRM
   */
  async createContact(contactData: Partial<AmoContact>): Promise<number> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await this.axiosInstance.post(
        '/api/v4/contacts',
        [contactData],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const contactId = response.data._embedded.contacts[0].id;
      this.logger.log(`Contact створено в AMO CRM: ${contactId}`);

      return contactId;
    } catch (error) {
      this.logger.error('Помилка створення contact в AMO CRM:', error.response?.data || error.message);
      throw new HttpException(
        'Failed to create contact in AMO CRM',
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
          // TODO: Оновити статус в нашій БД через LeadsService
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
          // TODO: Синхронізувати зміни в нашу БД
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
          // TODO: Створити відповідний lead в нашій БД
          processed++;
        } catch (error) {
          this.logger.error(`Помилка обробки нового lead ${newLead.id}:`, error.message);
          errors++;
        }
      }
    }

    this.logger.log(`Webhook оброблено: ${processed} успішно, ${errors} помилок`);
    return { processed, errors };
  }
}

