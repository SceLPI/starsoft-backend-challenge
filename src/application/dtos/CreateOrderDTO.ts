import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
class CreateOrderItem {
  @ApiProperty({
    example: 'item-1-uuid',
    description: 'ID of the item',
  })
  @IsUUID('all', {
    message: 'The provided ID is invalid',
  })
  itemId: string;

  @ApiProperty({ example: 2, description: 'Item quantity' })
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
  @ApiProperty({
    type: [CreateOrderItem],
    description: 'Lista de itens do pedido',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  items: CreateOrderItem[];
}
