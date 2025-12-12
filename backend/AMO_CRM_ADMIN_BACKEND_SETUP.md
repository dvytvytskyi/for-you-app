# Інструкція: AMO CRM інтеграція для Admin Panel Backend (Express.js)

## 📋 Огляд

Ця інструкція описує, як додати AMO CRM інтеграцію в Admin Panel Backend (Express.js). Адмін-панель буде центральним місцем для:
- OAuth2 авторизації з AMO CRM
- Синхронізації даних (pipelines, stages, leads, contacts, tasks)
- Налаштування мапінгу статусів
- Обробки webhooks

---

## 🎯 Архітектура

```
AMO CRM ↔ Admin Panel Backend (Express.js) ↔ Main Backend (NestJS) ↔ Mobile App
```

**Роль Admin Panel Backend:**
- OAuth2 авторизація та зберігання токенів
- Синхронізація з AMO CRM API
- Обробка webhooks
- Налаштування мапінгу статусів
- Відправка даних в Main Backend

---

## 📦 Крок 1: Встановлення залежностей

```bash
cd admin-panel-backend
npm install axios dotenv
```

**Залежності:**
- `axios` - для HTTP запитів до AMO CRM API
- `dotenv` - для змінних оточення (вже має бути встановлено)

---

## 📝 Крок 2: Налаштування .env

**Файл:** `admin-panel-backend/.env`

Додайте наступні змінні:

```env
# AMO CRM налаштування
AMO_DOMAIN=reforyou.amocrm.ru
AMO_CLIENT_ID=2912780f-a1e4-4d5d-a069-ee01422d8bef
AMO_CLIENT_SECRET=your-client-secret-here
AMO_ACCOUNT_ID=31920194
AMO_API_DOMAIN=api-b.amocrm.ru
AMO_REDIRECT_URI=https://admin.foryou-realestate.com/api/amo-crm/callback

# API ключ для комунікації з Main Backend
MAIN_BACKEND_API_KEY=your-secure-api-key
MAIN_BACKEND_URL=https://foryou-realestate.com/api/v1
```

**Примітка:** 
- `AMO_CLIENT_SECRET` отримайте з AMO CRM налаштувань
- `MAIN_BACKEND_API_KEY` - створіть безпечний ключ для комунікації між сервісами

---

## 📝 Крок 3: Створити AMO CRM Service

**Створити файл:** `admin-panel-backend/src/services/amo-crm.service.ts`

```typescript
import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

// Інтерфейси відповідно до AMO CRM API
export interface AmoAuthResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface AmoPipeline {
  id: number;
  name: string;
  sort: number;
  is_main: boolean;
  is_unsorted_on: boolean;
  is_archive: boolean;
  account_id: number;
  _embedded?: {
    statuses?: AmoStatus[];
  };
}

export interface AmoStatus {
  id: number;
  name: string;
  sort: number;
  is_editable: boolean;
  color?: string;
  pipeline_id: number;
}

export interface AmoLead {
  id?: number;
  name: string;
  price?: number;
  status_id?: number;
  pipeline_id?: number;
  responsible_user_id?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: AmoCustomField[];
  _embedded?: {
    contacts?: Array<{ id: number }>;
    companies?: Array<{ id: number }>;
  };
}

export interface AmoContact {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  responsible_user_id?: number;
  created_at?: number;
  updated_at?: number;
  custom_fields_values?: AmoCustomField[];
}

export interface AmoCustomField {
  field_id: number;
  field_name?: string;
  field_code?: string;
  field_type?: string;
  values: Array<{
    value: string | number;
    enum_id?: number;
    enum_code?: string;
  }>;
}

export interface AmoWebhookPayload {
  leads?: {
    status?: Array<{
      id: number;
      status_id: number;
      pipeline_id: number;
      old_status_id?: number;
    }>;
    add?: Array<{ id: number }>;
    update?: Array<{ id: number }>;
    delete?: Array<{ id: number }>;
  };
  contacts?: {
    add?: Array<{ id: number }>;
    update?: Array<{ id: number }>;
  };
  tasks?: {
    add?: Array<{ id: number }>;
    update?: Array<{ id: number }>;
    delete?: Array<{ id: number }>;
  };
  account?: {
    id: string;
    subdomain: string;
  };
}

export class AmoCrmService {
  private axiosInstance: AxiosInstance;
  private readonly domain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly accountId: string;
  private readonly apiDomain: string;
  private readonly mainBackendUrl: string;
  private readonly mainBackendApiKey: string;

  constructor() {
    this.domain = process.env.AMO_DOMAIN || '';
    this.clientId = process.env.AMO_CLIENT_ID || '';
    this.clientSecret = process.env.AMO_CLIENT_SECRET || '';
    this.redirectUri = process.env.AMO_REDIRECT_URI || '';
    this.accountId = process.env.AMO_ACCOUNT_ID || '';
    this.apiDomain = process.env.AMO_API_DOMAIN || '';
    this.mainBackendUrl = process.env.MAIN_BACKEND_URL || '';
    this.mainBackendApiKey = process.env.MAIN_BACKEND_API_KEY || '';

    this.axiosInstance = axios.create({
      baseURL: `https://${this.domain}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Отримати access token (з Main Backend)
   */
  private async getAccessToken(): Promise<string> {
    try {
      const response = await axios.get(`${this.mainBackendUrl}/integrations/amo-crm/token`, {
        headers: {
          'X-API-Key': this.mainBackendApiKey,
        },
      });
      return response.data.accessToken;
    } catch (error) {
      console.error('Failed to get token from main backend:', error);
      throw new Error('AMO CRM not authorized. Please authorize first.');
    }
  }

  /**
   * Обмін API ключа на authorization code
   */
  async exchangeApiKeyForCode(login: string, apiKey: string, state?: string): Promise<void> {
    try {
      console.log(`Exchanging API key for authorization code`);
      console.log(`Login: ${login}, Domain: ${this.domain}`);

      await axios.post(
        `https://${this.domain}/oauth2/exchange_api_key`,
        {
          login,
          api_key: apiKey,
          client_uuid: this.clientId,
          client_secret: this.clientSecret,
          ...(state && { state }),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('API key exchange request accepted. Authorization code will be sent to redirect URI.');
    } catch (error: any) {
      console.error('Error exchanging API key:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to exchange API key');
    }
  }

  /**
   * Обмін authorization code на токени
   */
  async exchangeCode(code: string): Promise<AmoAuthResponse> {
    try {
      console.log(`Starting OAuth exchange with domain: ${this.domain}`);

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

      // Зберегти токени в Main Backend
      await this.saveTokensToMainBackend(response.data);

      console.log('AMO CRM tokens successfully obtained and saved');
      return response.data;
    } catch (error: any) {
      console.error('Error exchanging authorization code:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code');
    }
  }

  /**
   * Зберегти токени в Main Backend
   */
  private async saveTokensToMainBackend(authData: AmoAuthResponse): Promise<void> {
    await axios.post(
      `${this.mainBackendUrl}/integrations/amo-crm/set-tokens`,
      {
        access_token: authData.access_token,
        refresh_token: authData.refresh_token,
        expires_in: authData.expires_in,
      },
      {
        headers: {
          'X-API-Key': this.mainBackendApiKey,
        },
      },
    );
  }

  /**
   * Перевірити статус підключення
   */
  async getConnectionStatus(): Promise<{
    connected: boolean;
    hasTokens: boolean;
    domain: string;
    accountId: string;
  }> {
    try {
      const token = await this.getAccessToken();
      return {
        connected: true,
        hasTokens: !!token,
        domain: this.domain,
        accountId: this.accountId,
      };
    } catch (error) {
      return {
        connected: false,
        hasTokens: false,
        domain: this.domain,
        accountId: this.accountId,
      };
    }
  }

  /**
   * Синхронізація pipelines та stages з AMO CRM
   */
  async syncPipelines(): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      // Отримати pipelines з AMO CRM
      const response = await axios.get<{ _embedded: { pipelines: AmoPipeline[] } }>(
        `https://${this.apiDomain}/api/v4/leads/pipelines`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const pipelines = response.data._embedded?.pipelines || [];
      let synced = 0;
      let errors = 0;

      // Відправити дані в Main Backend
      for (const pipeline of pipelines) {
        try {
          await axios.post(
            `${this.mainBackendUrl}/integrations/amo-crm/sync-pipelines`,
            {
              pipelines: [pipeline],
              stages: pipeline._embedded?.statuses || [],
            },
            {
              headers: {
                'X-API-Key': this.mainBackendApiKey,
              },
            },
          );
          synced++;
        } catch (error) {
          console.error(`Error syncing pipeline ${pipeline.id}:`, error);
          errors++;
        }
      }

      console.log(`Synced ${synced} pipelines, ${errors} errors`);
      return { synced, errors };
    } catch (error: any) {
      console.error('Error syncing pipelines:', error.response?.data || error.message);
      throw new Error('Failed to sync pipelines from AMO CRM');
    }
  }

  /**
   * Синхронізація leads з AMO CRM
   */
  async syncLeads(limit: number = 50): Promise<{ synced: number; errors: number }> {
    try {
      const accessToken = await this.getAccessToken();

      // Отримати leads з AMO CRM
      const response = await axios.get<{ _embedded: { leads: AmoLead[] } }>(
        `https://${this.apiDomain}/api/v4/leads`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit,
          },
        },
      );

      const leads = response.data._embedded?.leads || [];
      let synced = 0;
      let errors = 0;

      // Відправити дані в Main Backend
      for (const lead of leads) {
        try {
          await axios.post(
            `${this.mainBackendUrl}/integrations/amo-crm/sync-lead`,
            { lead },
            {
              headers: {
                'X-API-Key': this.mainBackendApiKey,
              },
            },
          );
          synced++;
        } catch (error) {
          console.error(`Error syncing lead ${lead.id}:`, error);
          errors++;
        }
      }

      console.log(`Synced ${synced} leads, ${errors} errors`);
      return { synced, errors };
    } catch (error: any) {
      console.error('Error syncing leads:', error.response?.data || error.message);
      throw new Error('Failed to sync leads from AMO CRM');
    }
  }

  /**
   * Створити lead в AMO CRM
   */
  async createLead(leadData: Partial<AmoLead>): Promise<number> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.post<{ _embedded: { leads: Array<{ id: number }> } }>(
        `https://${this.apiDomain}/api/v4/leads`,
        [leadData],
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const leadId = response.data._embedded?.leads[0]?.id;
      if (!leadId) {
        throw new Error('Failed to get lead ID from AMO CRM response');
      }

      console.log(`Lead created in AMO CRM: ${leadId}`);
      return leadId;
    } catch (error: any) {
      console.error('Error creating lead in AMO CRM:', error.response?.data || error.message);
      throw new Error('Failed to create lead in AMO CRM');
    }
  }

  /**
   * Оновити lead в AMO CRM
   */
  async updateLead(leadId: number, leadData: Partial<AmoLead>): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      await axios.patch(
        `https://${this.apiDomain}/api/v4/leads/${leadId}`,
        leadData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log(`Lead ${leadId} updated in AMO CRM`);
    } catch (error: any) {
      console.error('Error updating lead in AMO CRM:', error.response?.data || error.message);
      throw new Error('Failed to update lead in AMO CRM');
    }
  }

  /**
   * Отримати lead з AMO CRM
   */
  async getLead(leadId: number): Promise<AmoLead> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await axios.get<{ _embedded: { leads: AmoLead[] } }>(
        `https://${this.apiDomain}/api/v4/leads/${leadId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return response.data._embedded?.leads[0];
    } catch (error: any) {
      console.error('Error getting lead from AMO CRM:', error.response?.data || error.message);
      throw new Error('Failed to get lead from AMO CRM');
    }
  }

  /**
   * Обробити webhook від AMO CRM
   */
  async processWebhook(payload: AmoWebhookPayload): Promise<{ processed: number; errors: number }> {
    let processed = 0;
    let errors = 0;

    console.log('Processing webhook from AMO CRM:', JSON.stringify(payload, null, 2));

    // Обробка зміни статусу lead
    if (payload.leads?.status) {
      for (const statusUpdate of payload.leads.status) {
        try {
          // Відправити в Main Backend для обробки
          await axios.post(
            `${this.mainBackendUrl}/integrations/amo-crm/webhook`,
            {
              leads: {
                status: [statusUpdate],
              },
            },
            {
              headers: {
                'X-API-Key': this.mainBackendApiKey,
              },
            },
          );
          processed++;
        } catch (error) {
          console.error(`Error processing status update for lead ${statusUpdate.id}:`, error);
          errors++;
        }
      }
    }

    // Обробка нових leads
    if (payload.leads?.add) {
      for (const newLead of payload.leads.add) {
        try {
          const amoLead = await this.getLead(newLead.id);
          await axios.post(
            `${this.mainBackendUrl}/integrations/amo-crm/sync-lead`,
            { lead: amoLead },
            {
              headers: {
                'X-API-Key': this.mainBackendApiKey,
              },
            },
          );
          processed++;
        } catch (error) {
          console.error(`Error processing new lead ${newLead.id}:`, error);
          errors++;
        }
      }
    }

    return { processed, errors };
  }
}
```

---

## 📝 Крок 4: Створити Routes

**Створити файл:** `admin-panel-backend/src/routes/amo-crm.routes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { AmoCrmService } from '../services/amo-crm.service';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();
const amoCrmService = new AmoCrmService();

/**
 * POST /api/amo-crm/exchange-api-key
 * Обмін API ключа на authorization code
 */
router.post(
  '/exchange-api-key',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const { login, api_key, state } = req.body;

      if (!login || !api_key) {
        return res.status(400).json({
          success: false,
          message: 'login та api_key є обов\'язковими',
        });
      }

      await amoCrmService.exchangeApiKeyForCode(login, api_key, state);

      return res.status(202).json({
        success: true,
        message: 'API key exchange request accepted',
        note: 'Authorization code will be sent to redirect URI',
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to exchange API key',
      });
    }
  },
);

/**
 * GET /api/amo-crm/callback
 * OAuth callback endpoint
 */
router.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, from_exchange, state } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is missing',
      });
    }

    const tokens = await amoCrmService.exchangeCode(code as string);

    return res.json({
      success: true,
      message: 'AMO CRM successfully connected',
      fromExchange: from_exchange === '1',
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to exchange authorization code',
    });
  }
});

/**
 * GET /api/amo-crm/status
 * Перевірити статус підключення
 */
router.get(
  '/status',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const status = await amoCrmService.getConnectionStatus();
      return res.json({
        success: true,
        data: status,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get connection status',
      });
    }
  },
);

/**
 * POST /api/amo-crm/sync/pipelines
 * Синхронізація pipelines та stages
 */
router.post(
  '/sync/pipelines',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const result = await amoCrmService.syncPipelines();
      return res.json({
        success: true,
        message: 'Pipelines синхронізовано',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to sync pipelines',
      });
    }
  },
);

/**
 * POST /api/amo-crm/sync/leads
 * Синхронізація leads
 */
router.post(
  '/sync/leads',
  authenticate,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await amoCrmService.syncLeads(limit);
      return res.json({
        success: true,
        message: 'Leads синхронізовано',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to sync leads',
      });
    }
  },
);

/**
 * POST /api/amo-crm/create-lead
 * Створити lead в AMO CRM (викликається з Main Backend)
 */
router.post(
  '/create-lead',
  async (req: Request, res: Response) => {
    try {
      // Перевірка API ключа
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== process.env.MAIN_BACKEND_API_KEY) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { leadData } = req.body;
      const leadId = await amoCrmService.createLead(leadData);

      return res.json({
        success: true,
        data: {
          amoLeadId: leadId,
        },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to create lead in AMO CRM',
      });
    }
  },
);

/**
 * POST /api/amo-crm/update-lead
 * Оновити lead в AMO CRM (викликається з Main Backend)
 */
router.post(
  '/update-lead',
  async (req: Request, res: Response) => {
    try {
      // Перевірка API ключа
      const apiKey = req.headers['x-api-key'];
      if (apiKey !== process.env.MAIN_BACKEND_API_KEY) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { leadId, leadData } = req.body;
      await amoCrmService.updateLead(leadId, leadData);

      return res.json({
        success: true,
        message: 'Lead updated in AMO CRM',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update lead in AMO CRM',
      });
    }
  },
);

/**
 * POST /api/amo-crm/webhook
 * Webhook endpoint для прийому подій з AMO CRM
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const result = await amoCrmService.processWebhook(payload);

    return res.json({
      success: true,
      status: 'ok',
      processed: result.processed,
      errors: result.errors,
    });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to process webhook',
    });
  }
});

export default router;
```

---

## 📝 Крок 5: Підключити Routes до Server

**Файл:** `admin-panel-backend/src/server.ts`

Додайте:

```typescript
import amoCrmRoutes from './routes/amo-crm.routes';

// ... інші імпорти

// Після інших routes додайте:
app.use('/api/amo-crm', amoCrmRoutes);
```

---

## 🧪 Крок 6: Тестування

### Тест 1: OAuth авторизація

```bash
# 1. Обмін API ключа на код
curl -X POST https://admin.foryou-realestate.com/api/amo-crm/exchange-api-key \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "login": "your-email@example.com",
    "api_key": "your-api-key"
  }'

# 2. Перевірити статус
curl -X GET https://admin.foryou-realestate.com/api/amo-crm/status \
  -H "Authorization: Bearer <admin-token>"
```

### Тест 2: Синхронізація

```bash
# Синхронізація pipelines
curl -X POST https://admin.foryou-realestate.com/api/amo-crm/sync/pipelines \
  -H "Authorization: Bearer <admin-token>"

# Синхронізація leads
curl -X POST https://admin.foryou-realestate.com/api/amo-crm/sync/leads?limit=10 \
  -H "Authorization: Bearer <admin-token>"
```

---

## 🔧 Налаштування Webhook в AMO CRM

1. Зайдіть в AMO CRM → Налаштування → Віджеті та інтеграції → Webhooks
2. Додайте webhook URL:
   ```
   https://admin.foryou-realestate.com/api/amo-crm/webhook
   ```
3. Оберіть події:
   - ✅ Leads: статус змінився
   - ✅ Leads: додано
   - ✅ Leads: оновлено
   - ✅ Contacts: додано
   - ✅ Contacts: оновлено
   - ✅ Tasks: додано
   - ✅ Tasks: оновлено

---

## 📋 Чеклист реалізації

- [ ] Встановлено залежності (`axios`, `dotenv`)
- [ ] Додано змінні оточення в `.env`
- [ ] Створено `AmoCrmService` з усіма методами
- [ ] Створено routes для AMO CRM
- [ ] Підключено routes до server
- [ ] Налаштовано webhook в AMO CRM
- [ ] Протестовано OAuth авторизацію
- [ ] Протестовано синхронізацію
- [ ] Протестовано створення lead

---

## ⚠️ Важливі примітки

1. **Безпека:**
   - API ключі для комунікації між сервісами мають бути безпечними
   - OAuth токени зберігаються в Main Backend

2. **Помилки:**
   - Всі помилки логуються в консоль
   - Webhook завжди повертає 200 OK (навіть при помилках обробки)

3. **Синхронізація:**
   - Pipelines синхронізуються вручну з адмін-панелі
   - Leads можуть синхронізуватися автоматично через webhook

---

**Останнє оновлення:** Грудень 2025
