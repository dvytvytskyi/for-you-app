// Додаємо crypto глобально ПЕРЕД усіма імпортами
if (typeof globalThis.crypto === 'undefined') {
  const nodeCrypto = require('crypto');
  globalThis.crypto = nodeCrypto.webcrypto || nodeCrypto;
  // Також для застарілих модулів
  if (typeof global.crypto === 'undefined') {
    global.crypto = nodeCrypto.webcrypto || nodeCrypto;
  }
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Безпека
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN')?.split(',') || '*',
    credentials: true,
  });

  // Глобальні pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API Prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Swagger документація
  const config = new DocumentBuilder()
    .setTitle('For You Real Estate API')
    .setDescription('API документація для додатку For You Real Estate')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Endpoints для автентифікації')
    .addTag('Users', 'Управління користувачами')
    .addTag('Properties', 'Управління нерухомістю')
    .addTag('Leads', 'Управління заявками')
    .addTag('Content', 'Управління контентом')
    .addTag('Notifications', 'Push-сповіщення')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Додаток запущено на порту ${port}`);
  console.log(`📚 Swagger документація: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
