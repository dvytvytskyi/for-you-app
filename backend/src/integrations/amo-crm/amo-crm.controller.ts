import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AmoCrmService } from './amo-crm.service';
import { AmoWebhookDto } from './dto/amo-webhook.dto';

@ApiTags('AMO CRM Integration')
@Controller('integrations/amo-crm')
export class AmoCrmController {
  constructor(private readonly amoCrmService: AmoCrmService) {}

  /**
   * OAuth callback endpoint
   * Приймає authorization code і обмінює на токени
   */
  @Get('callback')
  @ApiOperation({ summary: 'OAuth2 callback для отримання токенів' })
  @ApiResponse({ status: 200, description: 'Токени успішно отримані' })
  async handleCallback(@Query('code') code: string) {
    await this.amoCrmService.exchangeCode(code);
    return {
      message: 'AMO CRM successfully connected',
      status: 'success',
    };
  }

  /**
   * Webhook endpoint для прийому подій з AMO CRM
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook для синхронізації з AMO CRM' })
  @ApiResponse({ status: 200, description: 'Webhook оброблено' })
  async handleWebhook(@Body() payload: AmoWebhookDto) {
    console.log('📥 AMO CRM Webhook received:', JSON.stringify(payload, null, 2));

    // TODO: Обробка різних типів подій
    if (payload.leads?.status) {
      // Оновлення статусу lead
      console.log('Lead status changed:', payload.leads.status);
    }

    if (payload.leads?.add) {
      // Новий lead додано в AMO
      console.log('New lead added:', payload.leads.add);
    }

    if (payload.leads?.update) {
      // Lead оновлено в AMO
      console.log('Lead updated:', payload.leads.update);
    }

    return { status: 'ok' };
  }

  /**
   * Test endpoint для перевірки інтеграції
   */
  @Get('test')
  @ApiOperation({ summary: 'Тестовий endpoint для перевірки підключення' })
  async testConnection() {
    // TODO: Додати логіку тестування підключення
    return {
      message: 'AMO CRM integration is ready',
      status: 'ok',
    };
  }
}

