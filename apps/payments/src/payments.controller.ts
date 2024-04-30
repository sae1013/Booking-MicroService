import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompletePaymentDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('complete_payments')
  @UsePipes(new ValidationPipe())
  async completePayments(@Payload() data: CompletePaymentDto) {
    return await this.paymentsService.completePayments(data);
  }
}
