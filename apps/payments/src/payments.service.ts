import { Body, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_URL } from '../constants';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';
import { CompletePaymentDto } from '@app/common';
@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {}
  async completePayments(@Body() completePaymentDto: CompletePaymentDto) {
    const {
      payInfo: { paymentId },
      amount,
    } = completePaymentDto;

    const paymentResponse = await this.httpService
      .get(`${PAYMENT_URL.PORTONE}/payments/${encodeURIComponent(paymentId)}`, {
        headers: {
          Authorization: `PortOne ${this.configService.get('PORTONE_API_SECRET')}`,
        },
      })
      .pipe(
        map((response) => {
          console.log('응답', response);
        }),
      );
    // validate payment here

    console.log('최종응답', paymentResponse);
  }
}
