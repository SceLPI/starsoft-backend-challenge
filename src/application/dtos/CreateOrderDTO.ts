import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
class CreateOrderItem {
  @IsUUID('all', {
    message: 'The provided ID is invalid',
  })
  itemId: string;

  @IsNumber(
    {},
    {
      message: 'The item quantity should be a number',
    },
  )
  @Min(1, {
    message: 'The item amount should be greater than one',
  })
  quantity: number;
}
export class CreateOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}
