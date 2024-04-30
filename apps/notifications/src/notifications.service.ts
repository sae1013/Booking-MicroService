import { Injectable } from '@nestjs/common';
import { ReservationNotificationDto } from '@app/common/dto/reservation_notification.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {}
  private readonly smtpTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      accessToken: this.configService.get('GOOGLE_OAUTH_ACCESS_TOKEN'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail({ email }: ReservationNotificationDto) {
    this.smtpTransporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject: '테스트',
      text: '테스트본문',
      html: '<h1>This is Notifications </h1>',
    });
  }
}
