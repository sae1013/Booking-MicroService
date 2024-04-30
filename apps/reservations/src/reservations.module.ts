import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from '@app/common';
import { ReservationRepository } from './reservations.repository';
import { ReservationSchema } from './models/reservation.schema';
import { ReservationDocument } from './models/reservation.schema';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  NOTIFICATIONS_SERVICE,
  PAYMENTS_SERVICE,
} from '@app/common/constants/services';
import { Transport } from '@nestjs/microservices';
@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: ReservationDocument.name,
        schema: ReservationSchema,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        NOTIFICATIONS_PORT: Joi.number().required(),
        NOTIFICATIONS_HOST: Joi.string().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            options: {
              transport: Transport.TCP,
              host: configService.get('AUTH_HOST'),
              port: configService.get('AUTH_PORT'),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            options: {
              transport: Transport.TCP,
              host: configService.get('PAYMENTS_HOST'),
              port: configService.get('PAYMENTS_PORT'),
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            options: {
              transport: Transport.TCP,
              host: configService.get('NOTIFICATIONS_HOST'),
              port: configService.get('NOTIFICATIONS_PORT'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
