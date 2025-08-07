import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOrderItemDTO } from './CreateOrderItemDTO';

export class CreateOrderDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDTO)
  items: CreateOrderItemDTO[];
}
