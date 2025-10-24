import { Controller, Get, Post, Put, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AmoCrmService } from './amo-crm.service';
import { AmoWebhookDto } from './dto/amo-webhook.dto';
import { UpdateStageMappingDto } from './dto/update-stage-mapping.dto';

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

  /**
   * Синхронізація pipelines і stages з AMO CRM
   */
  @Post('sync-pipelines')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Синхронізація воронок та етапів з AMO CRM' })
  @ApiResponse({ status: 200, description: 'Pipelines синхронізовано' })
  async syncPipelines() {
    const result = await this.amoCrmService.syncPipelines();
    return {
      message: 'Pipelines синхронізовано',
      ...result,
      status: 'success',
    };
  }

  /**
   * Отримати всі pipelines
   */
  @Get('pipelines')
  @ApiOperation({ summary: 'Отримати список воронок з БД' })
  @ApiResponse({ status: 200, description: 'Список воронок' })
  async getPipelines() {
    const pipelines = await this.amoCrmService.getPipelines();
    return {
      data: pipelines,
      count: pipelines.length,
    };
  }

  /**
   * Отримати stages конкретної воронки
   */
  @Get('pipelines/:pipelineId/stages')
  @ApiOperation({ summary: 'Отримати етапи конкретної воронки' })
  @ApiResponse({ status: 200, description: 'Список етапів' })
  async getStages(@Param('pipelineId') pipelineId: number) {
    const stages = await this.amoCrmService.getStages(pipelineId);
    return {
      data: stages,
      count: stages.length,
    };
  }

  /**
   * Оновити мапінг статусу для етапу
   */
  @Put('stages/:stageId/mapping')
  @ApiOperation({ summary: 'Оновити мапінг статусу для етапу AMO CRM' })
  @ApiResponse({ status: 200, description: 'Мапінг оновлено' })
  async updateStageMapping(
    @Param('stageId') stageId: number,
    @Body() dto: UpdateStageMappingDto,
  ) {
    const stage = await this.amoCrmService.updateStageMapping(stageId, dto.mappedStatus);
    return {
      message: 'Мапінг оновлено',
      data: stage,
    };
  }

  /**
   * Отримати рекомендації по автоматичному мапінгу
   */
  @Get('mapping/suggestions')
  @ApiOperation({ summary: 'Отримати рекомендації по автоматичному мапінгу статусів' })
  @ApiResponse({ status: 200, description: 'Рекомендації по мапінгу' })
  async getSuggestedMappings() {
    const suggestions = await this.amoCrmService.getSuggestedMappings();
    return {
      data: suggestions,
      count: suggestions.length,
    };
  }

  /**
   * Застосувати автоматичний мапінг
   */
  @Post('mapping/auto-apply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Автоматично застосувати рекомендований мапінг статусів' })
  @ApiResponse({ status: 200, description: 'Мапінг застосовано' })
  async applyAutoMapping() {
    const result = await this.amoCrmService.applyAutoMapping();
    return {
      message: 'Автоматичний мапінг застосовано',
      ...result,
      status: 'success',
    };
  }

  /**
   * Синхронізація leads з AMO CRM
   */
  @Post('sync-leads')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Синхронізувати leads з AMO CRM в нашу БД' })
  @ApiResponse({ status: 200, description: 'Leads синхронізовано' })
  async syncLeadsFromAmo(@Query('limit') limit?: number) {
    const result = await this.amoCrmService.syncLeadsFromAmo(limit || 50);
    return {
      message: 'Leads синхронізовано з AMO CRM',
      ...result,
      status: 'success',
    };
  }

  /**
   * Синхронізація ролей з AMO CRM
   */
  @Post('sync-roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Синхронізувати ролі з AMO CRM' })
  @ApiResponse({ status: 200, description: 'Ролі синхронізовано' })
  async syncRoles() {
    const result = await this.amoCrmService.syncRoles();
    return {
      message: 'Ролі синхронізовано з AMO CRM',
      ...result,
      status: 'success',
    };
  }

  /**
   * Синхронізація користувачів з AMO CRM
   */
  @Post('sync-users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Синхронізувати користувачів з AMO CRM' })
  @ApiResponse({ status: 200, description: 'Користувачів синхронізовано' })
  async syncUsers() {
    const result = await this.amoCrmService.syncUsers();
    return {
      message: 'Користувачів синхронізовано з AMO CRM',
      ...result,
      status: 'success',
    };
  }

  /**
   * Отримати список ролей
   */
  @Get('roles')
  @ApiOperation({ summary: 'Отримати список ролей AMO CRM' })
  @ApiResponse({ status: 200, description: 'Список ролей' })
  async getRoles() {
    const roles = await this.amoCrmService.getRoles();
    return {
      data: roles,
      count: roles.length,
    };
  }

  /**
   * Отримати список користувачів
   */
  @Get('users')
  @ApiOperation({ summary: 'Отримати список користувачів AMO CRM' })
  @ApiResponse({ status: 200, description: 'Список користувачів' })
  async getUsers() {
    const users = await this.amoCrmService.getUsers();
    return {
      data: users,
      count: users.length,
    };
  }
}

