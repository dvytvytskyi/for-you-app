import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrokerClientsService } from './broker-clients.service';
import { CreateBrokerClientDto } from './dto/create-broker-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Broker Clients (CRM)')
@Controller('broker-clients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BROKER, UserRole.ADMIN)
@ApiBearerAuth()
export class BrokerClientsController {
  constructor(private readonly brokerClientsService: BrokerClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Додати клієнта в CRM' })
  @ApiResponse({ status: 201, description: 'Клієнт доданий' })
  async create(@Body() createDto: CreateBrokerClientDto, @CurrentUser() user: any) {
    return this.brokerClientsService.create(user.id, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список клієнтів (BROKER: свої, ADMIN: всі)' })
  @ApiResponse({ status: 200, description: 'Список клієнтів' })
  async findAll(@CurrentUser() user: any) {
    return this.brokerClientsService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі клієнта' })
  @ApiResponse({ status: 200, description: 'Деталі клієнта' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brokerClientsService.findOne(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Оновити клієнта' })
  @ApiResponse({ status: 200, description: 'Клієнт оновлений' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: CreateBrokerClientDto,
    @CurrentUser() user: any,
  ) {
    return this.brokerClientsService.update(id, user, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити клієнта' })
  @ApiResponse({ status: 200, description: 'Клієнт видалений' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.brokerClientsService.remove(id, user);
    return { message: 'Client removed successfully' };
  }
}

