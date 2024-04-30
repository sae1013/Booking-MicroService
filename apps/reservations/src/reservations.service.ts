import { Inject, Injectable } from '@nestjs/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { NOTIFICATIONS_SERVICE, PAYMENTS_SERVICE, UserDto } from '@app/common';
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
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsServiceClient: ClientProxy,
  ) {}

  async create(createReservationDto: CreateReservationDto, user: UserDto) {
    let paymentInfo;
    try {
      paymentInfo = await lastValueFrom(
        this.paymentsServiceClient.send('complete_payments', {
          payInfo: createReservationDto.payInfo,
          amount: createReservationDto.amount,
          userEmail: user.email,
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
        invoiceId: paymentInfo.invoiceId,
        timestamp: new Date(),
        userId: user._id,
      });

      // NOTE: Send Reservation notification email to customer
      // NOTE: Please add Email Template files and pass through emit function not just sending email address

      this.notificationsServiceClient.emit('notify_email', {
        email: user.email,
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
