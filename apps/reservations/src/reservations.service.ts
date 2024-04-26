import { Inject, Injectable } from '@nestjs/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENTS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { lastValueFrom } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENTS_SERVICE)
    private readonly paymentsServiceClient: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId) {
    try {
      const paymentInfo = await lastValueFrom(
        this.paymentsServiceClient.send('complete_payments', {
          payInfo: createReservationDto.payInfo,
          amount: createReservationDto.amount,
        }),
      );
    } catch (err) {
      throw new HttpException(
        '주문정보가 실제 결제된 정보와 다릅니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const reservation = await this.reservationRepository.create({
        ...createReservationDto,
        timestamp: new Date(),
        userId,
      });
      return reservation;
    } catch (err) {
      throw Error(err);
    }
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(_id: string) {
    return this.reservationRepository.findOne({ _id });
  }

  async update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
