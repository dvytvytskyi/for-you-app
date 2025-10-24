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
    try {
      await this.amoCrmService.exchangeCode(code);
      return {
        message: 'AMO CRM successfully connected',
        status: 'success',
      };
    } catch (error) {
      return {
        statusCode: error.status || 400,
        message: error.message || 'Failed to exchange authorization code',
        details: error.response?.data || error.message,
      };
    }
  }

  /**
   * Webhook endpoint для прийому подій з AMO CRM
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook для синхронізації з AMO CRM' })
  @ApiResponse({ status: 200, description: 'Webhook оброблено' })
  async handleWebhook(@Body() payload: AmoWebhookDto) {
    const result = await this.amoCrmService.processWebhook(payload);
    return {
      status: 'ok',
      processed: result.processed,
      errors: result.errors,
    };
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

  /**
   * Ручне встановлення токенів (для development)
   */
  @Post('set-tokens')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Ручне збереження токенів (тільки для development)' })
  @ApiResponse({ status: 200, description: 'Токени збережені' })
  async setTokensManually(
    @Body() body: { access_token: string; refresh_token: string; expires_in?: number },
  ) {
    await this.amoCrmService.setTokensManually(
      body.access_token,
      body.refresh_token,
      body.expires_in || 86400,
    );
    return {
      message: 'AMO CRM токени успішно збережені',
      status: 'success',
    };
  }

  /**
   * Тестування створення lead в AMO CRM (для development)
   */
  @Post('test-lead')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Тестування створення lead в AMO CRM' })
  @ApiResponse({ status: 200, description: 'Lead створено' })
  async testCreateLead() {
    const testLead = {
      name: 'Тестовий lead з API',
      price: 100000,
    };

    const leadId = await this.amoCrmService.createLead(testLead);
    return {
      message: 'Lead успішно створено в AMO CRM',
      amoLeadId: leadId,
      status: 'success',
    };
  }
}

