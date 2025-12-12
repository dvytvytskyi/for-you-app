import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
// ТИМЧАСОВО ВИМКНЕНО через проблему з crypto
// import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as xml2js from 'xml2js';
import { In } from 'typeorm';
import { Property, PropertyType } from '../../database/entities/property.entity';
import { Developer } from '../../database/entities/developer.entity';
import { PropertyImage } from '../../database/entities/property-image.entity';
import { SyncLog, SyncStatus, SyncType } from '../../database/entities/sync-log.entity';

interface XMLProperty {
  id: string;
  title: string;
  description?: string;
  type?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  developer?: string;
  status?: string;
}

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);
  private xmlFeedUrl: string;

  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    
    @InjectRepository(Developer)
    private developerRepository: Repository<Developer>,
    
    @InjectRepository(PropertyImage)
    private propertyImageRepository: Repository<PropertyImage>,
    
    @InjectRepository(SyncLog)
    private syncLogRepository: Repository<SyncLog>,
    
    private configService: ConfigService,
  ) {
    this.xmlFeedUrl = this.configService.get<string>('XML_FEED_URL') || '';
    if (this.xmlFeedUrl) {
      this.logger.log(`✅ XML Sync configured: ${this.xmlFeedUrl}`);
    } else {
      this.logger.warn('⚠️ XML_FEED_URL not configured. XML sync will be disabled.');
    }
  }

  /**
   * Автоматична синхронізація (щоденно о 3:00)
   */
  // ТИМЧАСОВО ВИМКНЕНО через проблему з crypto
  // @Cron(CronExpression.EVERY_DAY_AT_3AM)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleScheduledSync() {
    if (!this.xmlFeedUrl) {
      this.logger.warn('XML sync skipped: XML_FEED_URL not configured');
      return;
    }

    this.logger.log('🔄 Starting scheduled XML sync...');
    await this.syncProperties(SyncType.SCHEDULED);
  }

  /**
   * Ручна синхронізація (викликається через API)
   */
  async syncPropertiesManually(): Promise<SyncLog> {
    this.logger.log('🔄 Starting manual XML sync...');
    return this.syncProperties(SyncType.MANUAL);
  }

  /**
   * Основна логіка синхронізації
   */
  async syncProperties(type: SyncType = SyncType.PROPERTIES): Promise<SyncLog> {
    const startTime = Date.now();
    
    // Створюємо лог синхронізації
    const syncLog = this.syncLogRepository.create({
      type,
      status: SyncStatus.SUCCESS, // Буде оновлено в кінці
      metadata: { url: this.xmlFeedUrl },
    });

    let createdCount = 0;
    let updatedCount = 0;
    let archivedCount = 0;
    let failedCount = 0;

    try {
      // 1. Завантажуємо XML
      this.logger.log(`📥 Fetching XML from ${this.xmlFeedUrl}...`);
      const xmlData = await this.fetchXML(this.xmlFeedUrl);

      // 2. Парсимо XML
      this.logger.log('🔍 Parsing XML...');
      const properties = await this.parseXML(xmlData);
      this.logger.log(`📊 Found ${properties.length} properties in XML`);

      // 3. Отримуємо існуючі properties з БД
      const existingProperties = await this.propertyRepository.find({
        where: { externalId: In(properties.map(p => p.id)) },
        relations: ['images'],
      });

      const existingMap = new Map(existingProperties.map(p => [p.externalId, p]));
      const xmlIds = new Set(properties.map(p => p.id));

      // 4. Синхронізуємо properties (батчами по 50)
      const batchSize = 50;
      for (let i = 0; i < properties.length; i += batchSize) {
        const batch = properties.slice(i, i + batchSize);
        
        for (const xmlProperty of batch) {
          try {
            const existingProperty = existingMap.get(xmlProperty.id);

            if (existingProperty) {
              // Оновлюємо існуючий
              await this.updateProperty(existingProperty, xmlProperty);
              updatedCount++;
            } else {
              // Створюємо новий
              await this.createProperty(xmlProperty);
              createdCount++;
            }
          } catch (error) {
            this.logger.error(`❌ Failed to process property ${xmlProperty.id}: ${error.message}`);
            failedCount++;
          }
        }

        this.logger.log(`✅ Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(properties.length / batchSize)}`);
      }

      // 5. Архівуємо properties, яких немає в XML (м'яке видалення)
      const propertiesToArchive = existingProperties.filter(p => !xmlIds.has(p.externalId));
      
      if (propertiesToArchive.length > 0) {
        await this.propertyRepository.update(
          { id: In(propertiesToArchive.map(p => p.id)) },
          { isArchived: true },
        );
        archivedCount = propertiesToArchive.length;
        this.logger.log(`🗄️ Archived ${archivedCount} properties`);
      }

      // 6. Оновлюємо лог
      const duration = Date.now() - startTime;
      syncLog.status = failedCount === properties.length ? SyncStatus.FAILED : 
                      failedCount > 0 ? SyncStatus.PARTIAL : SyncStatus.SUCCESS;
      syncLog.createdCount = createdCount;
      syncLog.updatedCount = updatedCount;
      syncLog.archivedCount = archivedCount;
      syncLog.failedCount = failedCount;
      syncLog.totalProcessed = properties.length;
      syncLog.durationMs = duration;

      await this.syncLogRepository.save(syncLog);

      this.logger.log(
        `✅ Sync completed in ${(duration / 1000).toFixed(2)}s: ` +
        `${createdCount} created, ${updatedCount} updated, ${archivedCount} archived, ${failedCount} failed`,
      );

      return syncLog;

    } catch (error) {
      // Помилка синхронізації
      const duration = Date.now() - startTime;
      syncLog.status = SyncStatus.FAILED;
      syncLog.durationMs = duration;
      syncLog.errorMessage = error.message;
      syncLog.createdCount = createdCount;
      syncLog.updatedCount = updatedCount;
      syncLog.archivedCount = archivedCount;
      syncLog.failedCount = failedCount;

      await this.syncLogRepository.save(syncLog);

      this.logger.error(`❌ Sync failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Завантажити XML з URL
   */
  private async fetchXML(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        timeout: 30000, // 30 seconds
        headers: {
          'User-Agent': 'For-You-Real-Estate/1.0',
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch XML: ${error.message}`);
      throw new Error(`Failed to fetch XML from ${url}: ${error.message}`);
    }
  }

  /**
   * Парсити XML в масив properties
   */
  private async parseXML(xmlData: string): Promise<XMLProperty[]> {
    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
    });

    try {
      const result = await parser.parseStringPromise(xmlData);
      
      // Припускаємо структуру XML типу:
      // <properties>
      //   <property>
      //     <id>123</id>
      //     <title>...</title>
      //     ...
      //   </property>
      // </properties>
      
      const properties = result?.properties?.property || [];
      const propertiesArray = Array.isArray(properties) ? properties : [properties];

      return propertiesArray.map(p => this.mapXMLToProperty(p));
    } catch (error) {
      this.logger.error(`Failed to parse XML: ${error.message}`);
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  }

  /**
   * Мапити XML property в наш формат
   */
  private mapXMLToProperty(xmlProp: any): XMLProperty {
    // Парсимо images
    let images: string[] = [];
    if (xmlProp.images) {
      if (typeof xmlProp.images === 'string') {
        images = [xmlProp.images];
      } else if (Array.isArray(xmlProp.images)) {
        images = xmlProp.images;
      } else if (xmlProp.images.image) {
        images = Array.isArray(xmlProp.images.image) ? xmlProp.images.image : [xmlProp.images.image];
      }
    }

    return {
      id: String(xmlProp.id || xmlProp.external_id),
      title: xmlProp.title || xmlProp.name,
      description: xmlProp.description,
      type: xmlProp.type,
      price: parseFloat(xmlProp.price) || 0,
      bedrooms: parseInt(xmlProp.bedrooms) || undefined,
      bathrooms: parseInt(xmlProp.bathrooms) || undefined,
      area: parseFloat(xmlProp.area) || undefined,
      address: xmlProp.address,
      city: xmlProp.city,
      country: xmlProp.country || 'UAE',
      latitude: parseFloat(xmlProp.latitude) || undefined,
      longitude: parseFloat(xmlProp.longitude) || undefined,
      images: images.filter(Boolean),
      developer: xmlProp.developer,
      status: xmlProp.status,
    };
  }

  /**
   * Створити новий property
   */
  private async createProperty(xmlProp: XMLProperty): Promise<Property> {
    // Знайти або створити Developer
    let developer: Developer | null = null;
    if (xmlProp.developer) {
      developer = await this.developerRepository.findOne({
        where: { name: xmlProp.developer },
      });

      if (!developer) {
        developer = this.developerRepository.create({
          name: xmlProp.developer,
        });
        await this.developerRepository.save(developer);
      }
    }

    // Створюємо Property
    const property = this.propertyRepository.create({
      externalId: xmlProp.id,
      titleEn: xmlProp.title,
      descriptionEn: xmlProp.description || '',
      type: this.mapPropertyType(xmlProp.type),
      minPrice: xmlProp.price,
      maxPrice: xmlProp.price,
      address: xmlProp.address || '',
      latitude: xmlProp.latitude || 0,
      longitude: xmlProp.longitude || 0,
      developer: developer || undefined,
      isSoldOut: xmlProp.status?.toLowerCase() === 'sold',
      isExclusive: false, // З XML завжди не ексклюзивні
      isArchived: false,
    });

    const savedProperty = await this.propertyRepository.save(property);

    // Додаємо images
    if (xmlProp.images && xmlProp.images.length > 0) {
      const images = xmlProp.images.map((url, index) =>
        this.propertyImageRepository.create({
          property: savedProperty,
          imageUrl: url,
          orderIndex: index,
        }),
      );
      await this.propertyImageRepository.save(images);
    }

    return savedProperty;
  }

  /**
   * Оновити існуючий property
   */
  private async updateProperty(existing: Property, xmlProp: XMLProperty): Promise<Property> {
    // Оновлюємо основні поля
    existing.titleEn = xmlProp.title;
    existing.descriptionEn = xmlProp.description || '';
    existing.type = this.mapPropertyType(xmlProp.type);
    existing.minPrice = xmlProp.price || 0;
    existing.maxPrice = xmlProp.price || 0;
    if (xmlProp.address) existing.address = xmlProp.address;
    if (xmlProp.latitude) existing.latitude = xmlProp.latitude;
    if (xmlProp.longitude) existing.longitude = xmlProp.longitude;
    existing.isSoldOut = xmlProp.status?.toLowerCase() === 'sold';
    existing.isArchived = false; // З XML = активний

    // Оновлюємо Developer
    if (xmlProp.developer) {
      let developer = await this.developerRepository.findOne({
        where: { name: xmlProp.developer },
      });

      if (!developer) {
        developer = this.developerRepository.create({
          name: xmlProp.developer,
        });
        await this.developerRepository.save(developer);
      }

      existing.developer = developer;
    }

    const updated = await this.propertyRepository.save(existing);

    // Оновлюємо images (видаляємо старі, додаємо нові)
    if (xmlProp.images && xmlProp.images.length > 0) {
      // Видаляємо старі images
      if (existing.images && existing.images.length > 0) {
        await this.propertyImageRepository.remove(existing.images);
      }

      // Додаємо нові
      const images = xmlProp.images.map((url, index) =>
        this.propertyImageRepository.create({
          property: updated,
          imageUrl: url,
          orderIndex: index,
        }),
      );
      await this.propertyImageRepository.save(images);
    }

    return updated;
  }

  /**
   * Мапити тип property з XML
   */
  private mapPropertyType(type?: string): PropertyType {
    if (!type) return PropertyType.APARTMENT;

    const normalized = type.toLowerCase();
    
    if (normalized.includes('villa')) return PropertyType.VILLA;
    if (normalized.includes('penthouse')) return PropertyType.PENTHOUSE;
    if (normalized.includes('townhouse')) return PropertyType.TOWNHOUSE;
    if (normalized.includes('land') || normalized.includes('plot')) return PropertyType.LAND;
    if (normalized.includes('apartment')) return PropertyType.APARTMENT;
    
    return PropertyType.RESIDENTIAL_COMPLEX;
  }

  /**
   * Отримати останніSync Logs
   */
  async getSyncLogs(limit: number = 20): Promise<SyncLog[]> {
    return this.syncLogRepository.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Отримати статистику синхронізації
   */
  async getSyncStats(): Promise<{
    lastSync: SyncLog | null;
    totalSyncs: number;
    successRate: number;
  }> {
    const logs = await this.syncLogRepository.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });

    const lastSync = logs[0] || null;
    const totalSyncs = logs.length;
    const successCount = logs.filter(l => l.status === SyncStatus.SUCCESS).length;
    const successRate = totalSyncs > 0 ? (successCount / totalSyncs) * 100 : 0;

    return {
      lastSync,
      totalSyncs,
      successRate: Math.round(successRate * 100) / 100,
    };
  }
}

