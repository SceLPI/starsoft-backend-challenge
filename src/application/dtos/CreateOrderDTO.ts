import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
class CreateOrderItem {
  @IsUUID()
  itemId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
export class CreateOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}
