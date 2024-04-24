import { createChargeDto } from '@app/common';
import { CardDto } from '@app/common/dto/card.dto';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  invoiceId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  card: CardDto;

  @IsNumber()
  amount: number;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => createChargeDto)
  charge: createChargeDto;
}
