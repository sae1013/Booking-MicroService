import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('complete_payments')
  async completePayments(@Payload() data: any) {
    return await this.paymentsService.completePayments(data);
  }
}
