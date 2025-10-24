import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFiltersDto } from './dto/lead-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити заявку (для authenticated або guest users)' })
  @ApiResponse({ status: 201, description: 'Заявка створена' })
  async create(@Body() createLeadDto: CreateLeadDto, @CurrentUser() user?: any) {
    const userId = user?.id;
    return this.leadsService.create(createLeadDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати список заявок (BROKER/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Список заявок' })
  async findAll(@Query() filters: LeadFiltersDto, @CurrentUser() user: any) {
    return this.leadsService.findAll(filters, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати деталі заявки (BROKER/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Деталі заявки' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.findOne(id, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити заявку (BROKER/ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Заявка оновлена' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() user: any,
  ) {
    return this.leadsService.update(id, updateLeadDto, user);
  }

  @Post(':id/take')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BROKER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Взяти заявку з пулу (BROKER only)' })
  @ApiResponse({ status: 200, description: 'Заявку взято' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async takeLead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leadsService.takeLead(id, user.id);
  }

  @Post(':id/assign/:brokerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Призначити заявку брокеру (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Брокер призначений' })
  async assignBroker(@Param('id') id: string, @Param('brokerId') brokerId: string) {
    return this.leadsService.assignBroker(id, brokerId);
  }
}

