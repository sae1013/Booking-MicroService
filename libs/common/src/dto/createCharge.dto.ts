import { Type } from 'class-transformer';
import { CardDto } from './card.dto';
import { IsDefined, IsNotEmptyObject, ValidateNested } from 'class-validator';

export class createChargeDto {
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => CardDto)
  card: CardDto;
  amount: number;
}
