import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  app.useLogger(app.get(Logger));

  await app.listen(app.get(ConfigService).get('PORT'));
}
bootstrap();
