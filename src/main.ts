import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initSentry } from './infrastructure/monitoring/sentyMonitor';

async function bootstrap() {
  initSentry();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Starsoft Order API')
    .setDescription('Orders CRUD Documentation')
    .setVersion('1.0.0')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(new ValidationPipe({}));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
