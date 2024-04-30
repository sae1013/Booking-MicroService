import { IsEmail } from 'class-validator';

export class ReservationNotificationDto {
  @IsEmail()
  email: string;
}
