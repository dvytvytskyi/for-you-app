import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  key: string;
  bucket: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private s3: AWS.S3;
  private bucket: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET') || '';

    this.s3 = new AWS.S3({
      region: this.region,
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });

    this.logger.log(`✅ AWS S3 initialized (bucket: ${this.bucket}, region: ${this.region})`);
  }

  /**
   * Завантажити файл на S3
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<UploadResult> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // Публічний доступ для читання
    };

    try {
      const result = await this.s3.upload(params).promise();
      
      this.logger.log(`✅ File uploaded: ${result.Key}`);

      return {
        url: result.Location,
        key: result.Key,
        bucket: this.bucket,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to upload file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Завантажити декілька файлів
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads',
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Видалити файл з S3
   */
  async deleteFile(key: string): Promise<void> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.deleteObject(params).promise();
      this.logger.log(`✅ File deleted: ${key}`);
    } catch (error) {
      this.logger.error(`❌ Failed to delete file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Видалити декілька файлів
   */
  async deleteFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFile(key));
    await Promise.all(deletePromises);
  }

  /**
   * Отримати підписаний URL для приватного файлу (якщо треба)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn, // seconds
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  /**
   * Перевірити чи існує файл
   */
  async fileExists(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      await this.s3.headObject(params).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Отримати розмір файлу
   */
  async getFileSize(key: string): Promise<number> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    };

    try {
      const result = await this.s3.headObject(params).promise();
      return result.ContentLength || 0;
    } catch (error) {
      this.logger.error(`❌ Failed to get file size: ${error.message}`);
      throw error;
    }
  }

  /**
   * Копіювати файл
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<UploadResult> {
    const params: AWS.S3.CopyObjectRequest = {
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${sourceKey}`,
      Key: destinationKey,
      ACL: 'public-read',
    };

    try {
      await this.s3.copyObject(params).promise();
      
      const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${destinationKey}`;

      this.logger.log(`✅ File copied: ${sourceKey} → ${destinationKey}`);

      return {
        url,
        key: destinationKey,
        bucket: this.bucket,
      };
    } catch (error) {
      this.logger.error(`❌ Failed to copy file: ${error.message}`);
      throw error;
    }
  }
}

