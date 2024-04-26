import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PAYMENT_URL } from '../constants';
import { HttpService } from '@nestjs/axios';
import { map, tap, firstValueFrom } from 'rxjs';
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

    const paymentResponse = await firstValueFrom(
      this.httpService
        .get(
          `${PAYMENT_URL.PORTONE}/payments/${encodeURIComponent(paymentId)}`,
          {
            headers: {
              Authorization: `PortOne ${this.configService.get('PORTONE_API_SECRET')}`,
            },
          },
        )
        .pipe(
          tap((response) => {
            return response.data;
          }),
          map((response) => {
            return response.data;
          }),
        ),
    );
    // validate payment here
    const { success, errorMessage } = this.validatePayments(
      paymentResponse,
      amount,
    );
    if (success) {
      return {
        orderName: paymentResponse.orderName,
        amount: paymentResponse.amount,
        paidAt: paymentResponse.paidAt,
      };
    } else {
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  validatePayments(paymentResponse, amount) {
    if (paymentResponse.amount.paid != amount) {
      return {
        success: false,
        errorMessage: '주문금액이 실제 결제된 금액과 일치하지 않습니다.',
      };
    }
    return {
      success: true,
      errorMessage: '',
    };
  }
}
