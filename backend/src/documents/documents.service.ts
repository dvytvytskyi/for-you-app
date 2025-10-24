import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentType, DocumentCategory } from '../database/entities/document.entity';
import { MediaService } from '../integrations/media/media.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityAction, ActivityEntity } from '../database/entities/activity-log.entity';

interface UploadDocumentDto {
  file: Express.Multer.File;
  type: DocumentType;
  entityType: DocumentCategory;
  entityId: string;
  description?: string;
  isPublic?: boolean;
  uploadedBy: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    
    private readonly mediaService: MediaService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  /**
   * Завантажити документ
   */
  async uploadDocument(dto: UploadDocumentDto): Promise<Document> {
    const { file, type, entityType, entityId, description, isPublic, uploadedBy } = dto;

    // Визначаємо папку для документів
    const folder = `documents/${entityType.toLowerCase()}/${entityId}`;

    // Завантажуємо файл на S3
    const uploadResult = await this.mediaService.uploadFile(file, folder);

    // Створюємо запис документа
    const document = this.documentRepository.create({
      type,
      entityType,
      entityId,
      fileName: uploadResult.key.split('/').pop(),
      originalName: file.originalname,
      fileUrl: uploadResult.url,
      s3Key: uploadResult.key,
      mimeType: file.mimetype,
      fileSize: file.size,
      description,
      isPublic: isPublic || false,
      uploadedBy,
      // Встановлюємо релейшени в залежності від entityType
      propertyId: entityType === DocumentCategory.PROPERTY ? entityId : undefined,
      leadId: entityType === DocumentCategory.LEAD ? entityId : undefined,
      userId: entityType === DocumentCategory.USER ? entityId : undefined,
    });

    const savedDocument = await this.documentRepository.save(document);

    // Логуємо upload
    await this.activityLogService.log({
      userId: uploadedBy,
      action: ActivityAction.MEDIA_UPLOAD,
      entityType: ActivityEntity.MEDIA,
      entityId: savedDocument.id,
      description: `Uploaded document: ${type} for ${entityType} ${entityId}`,
    });

    return savedDocument;
  }

  /**
   * Отримати всі документи для сутності
   */
  async getDocumentsByEntity(
    entityType: DocumentCategory,
    entityId: string,
    userId?: string,
  ): Promise<Document[]> {
    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.uploadedByUser', 'uploadedByUser')
      .where('document.entityType = :entityType', { entityType })
      .andWhere('document.entityId = :entityId', { entityId })
      .orderBy('document.createdAt', 'DESC');

    // Якщо не ADMIN, показуємо тільки публічні або свої документи
    if (userId) {
      queryBuilder.andWhere('(document.isPublic = true OR document.uploadedBy = :userId)', { userId });
    }

    return queryBuilder.getMany();
  }

  /**
   * Отримати документ по ID
   */
  async getDocument(documentId: string, userId?: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['uploadedByUser', 'property', 'lead', 'user'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Перевірка доступу (якщо не публічний)
    if (!document.isPublic && userId && document.uploadedBy !== userId) {
      throw new ForbiddenException('You do not have access to this document');
    }

    return document;
  }

  /**
   * Видалити документ
   */
  async deleteDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Перевірка прав (тільки той хто завантажив може видалити)
    if (document.uploadedBy !== userId) {
      throw new ForbiddenException('You can only delete your own documents');
    }

    // Видаляємо файл з S3
    await this.mediaService.deleteFile(document.s3Key);

    // Видаляємо запис з БД
    await this.documentRepository.remove(document);

    // Логуємо видалення
    await this.activityLogService.log({
      userId,
      action: ActivityAction.MEDIA_DELETE,
      entityType: ActivityEntity.MEDIA,
      entityId: documentId,
      description: `Deleted document: ${document.type}`,
    });
  }

  /**
   * Оновити метадані документа (тільки uploadedBy або ADMIN)
   */
  async updateDocument(
    documentId: string,
    updates: {
      description?: string;
      isPublic?: boolean;
      isVerified?: boolean;
    },
    userId: string,
  ): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Перевірка прав
    if (document.uploadedBy !== userId) {
      throw new ForbiddenException('You can only update your own documents');
    }

    // Оновлюємо
    if (updates.description !== undefined) {
      document.description = updates.description;
    }
    if (updates.isPublic !== undefined) {
      document.isPublic = updates.isPublic;
    }
    if (updates.isVerified !== undefined) {
      document.isVerified = updates.isVerified;
    }

    return this.documentRepository.save(document);
  }

  /**
   * Верифікувати документ (тільки ADMIN)
   */
  async verifyDocument(documentId: string, userId: string): Promise<Document> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    document.isVerified = true;
    const updated = await this.documentRepository.save(document);

    // Логуємо верифікацію
    await this.activityLogService.log({
      userId,
      action: ActivityAction.USER_UPDATE,
      entityType: ActivityEntity.MEDIA,
      entityId: documentId,
      description: `Verified document: ${document.type}`,
    });

    return updated;
  }

  /**
   * Отримати всі документи для адміна з фільтрами
   */
  async getAllDocuments(filters: {
    entityType?: DocumentCategory;
    type?: DocumentType;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Document[]; total: number; page: number; limit: number; totalPages: number }> {
    const { entityType, type, isVerified, page = 1, limit = 50 } = filters;

    const queryBuilder = this.documentRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.uploadedByUser', 'uploadedByUser')
      .leftJoinAndSelect('document.property', 'property')
      .leftJoinAndSelect('document.lead', 'lead')
      .leftJoinAndSelect('document.user', 'user')
      .orderBy('document.createdAt', 'DESC');

    if (entityType) {
      queryBuilder.andWhere('document.entityType = :entityType', { entityType });
    }

    if (type) {
      queryBuilder.andWhere('document.type = :type', { type });
    }

    if (isVerified !== undefined) {
      queryBuilder.andWhere('document.isVerified = :isVerified', { isVerified });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { data, total, page, limit, totalPages };
  }
}

