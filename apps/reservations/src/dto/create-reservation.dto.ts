import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
  IsNumber,
} from 'class-validator';
import { payInfoDto } from '@app/common';
export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsNotEmpty()
  placeId: string;

  @IsNumber()
  amount: number;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => payInfoDto)
  payInfo: payInfoDto;
}
