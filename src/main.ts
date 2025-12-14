import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logger/log.service';
import { LoggingInterceptor } from './logger/log.interceptor';
import { AllExceptionsFilter } from './logger/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const logger = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  process.on('uncaughtException', (err) => {
    logger.error('uncaughtException', err);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('unhandledRejection', reason);
  });

  const config = new DocumentBuilder()
    .setTitle('REST Service')
    .setDescription('Home Library Service')
    .setVersion('1.0')
    .addTag('REST')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
