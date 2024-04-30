import { Type } from 'class-transformer';
import { payInfoDto } from './payInfo.dto';
import {
  IsNumber,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

export class CompletePaymentDto {
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => payInfoDto)
  payInfo: payInfoDto;

  @IsNumber()
  amount: number;
}
