import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../database/entities/user.entity';
import { DocumentType, DocumentCategory } from '../database/entities/document.entity';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @Roles(UserRole.BROKER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Завантажити документ' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'type', 'entityType', 'entityId'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: Object.values(DocumentType),
        },
        entityType: {
          type: 'string',
          enum: Object.values(DocumentCategory),
        },
        entityId: {
          type: 'string',
          format: 'uuid',
        },
        description: {
          type: 'string',
        },
        isPublic: {
          type: 'boolean',
          default: false,
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB
      },
      fileFilter: (req, file, cb) => {
        // Дозволені типи документів
        const allowedMimes = [
          'application/pdf',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type. Only PDF, Images, Word, Excel are allowed.'), false);
        }
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadDocumentDto,
    @CurrentUser('id') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.documentsService.uploadDocument({
      file,
      ...dto,
      uploadedBy: userId,
    });
  }

  @Get('entity/:entityType/:entityId')
  @ApiOperation({ summary: 'Отримати всі документи для сутності' })
  async getDocumentsByEntity(
    @Param('entityType') entityType: DocumentCategory,
    @Param('entityId') entityId: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.documentsService.getDocumentsByEntity(entityType, entityId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати документ по ID' })
  async getDocument(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.documentsService.getDocument(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити метадані документа' })
  async updateDocument(
    @Param('id') id: string,
    @Body() dto: UpdateDocumentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.documentsService.updateDocument(id, dto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити документ' })
  async deleteDocument(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.documentsService.deleteDocument(id, userId);
    return { message: 'Document deleted successfully' };
  }

  @Post(':id/verify')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Верифікувати документ (тільки ADMIN)' })
  async verifyDocument(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.documentsService.verifyDocument(id, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Отримати всі документи з фільтрами (тільки ADMIN)' })
  @ApiQuery({ name: 'entityType', required: false, enum: DocumentCategory })
  @ApiQuery({ name: 'type', required: false, enum: DocumentType })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllDocuments(
    @Query('entityType') entityType?: DocumentCategory,
    @Query('type') type?: DocumentType,
    @Query('isVerified') isVerified?: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.documentsService.getAllDocuments({
      entityType,
      type,
      isVerified,
      page,
      limit,
    });
  }
}

