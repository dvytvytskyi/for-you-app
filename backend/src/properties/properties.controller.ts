import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { PropertyFiltersDto } from './dto/property-filters.dto';
import { PaginatedPropertiesResponseDto, PropertyResponseDto } from './dto/property-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: 'Отримати список нерухомості з фільтрами та пагінацією' })
  @ApiResponse({ status: 200, description: 'Список нерухомості', type: PaginatedPropertiesResponseDto })
  async findAll(@Query() filters: PropertyFiltersDto): Promise<PaginatedPropertiesResponseDto> {
    return this.propertiesService.findAll(filters);
  }

  @Get('exclusive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.INVESTOR, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати ексклюзивні пропозиції (тільки для INVESTOR)' })
  @ApiResponse({ status: 200, description: 'Ексклюзивні пропозиції', type: PaginatedPropertiesResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findExclusive(@Query() filters: PropertyFiltersDto): Promise<PaginatedPropertiesResponseDto> {
    return this.propertiesService.findExclusive(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати деталі нерухомості за ID' })
  @ApiResponse({ status: 200, description: 'Деталі нерухомості', type: PropertyResponseDto })
  @ApiResponse({ status: 404, description: 'Property not found' })
  async findOne(@Param('id') id: string): Promise<PropertyResponseDto> {
    return this.propertiesService.findOne(id) as any;
  }
}

