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

    this.axiosInstance = axios.create({
      baseURL: `https://${this.apiDomain}`,
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
      this.logger.error('Помилка обміну authorization code:', error.response?.data || error.message);
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
      this.logger.error('Помилка створення lead в AMO CRM:', error.response?.data || error.message);
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
    const amoLead: Partial<AmoLead> = {
      name: `Lead #${lead.id} - ${lead.property?.title || 'Property'}`,
      price: lead.property?.price || 0,
      custom_fields_values: [
        {
          field_id: 0, // Замінити на реальний ID поля "Телефон"
          values: [{ value: lead.guestPhone || lead.client?.phone }],
        },
        {
          field_id: 0, // Замінити на реальний ID поля "Email"
          values: [{ value: lead.guestEmail || lead.client?.email }],
        },
      ],
    };

    if (contactId) {
      amoLead._embedded = {
        contacts: [{ id: contactId }],
      };
    }

    return amoLead;
  }
}

