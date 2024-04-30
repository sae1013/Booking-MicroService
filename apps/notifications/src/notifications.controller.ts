import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReservationNotificationDto } from '@app/common/dto/reservation_notification.dto';
@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: ReservationNotificationDto) {
    this.notificationsService.notifyEmail(data);
  }
}
