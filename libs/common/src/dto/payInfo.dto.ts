import { IsNotEmpty, IsString } from 'class-validator';

export class payInfoDto {
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @IsString()
  @IsNotEmpty()
  txId: string;
}
