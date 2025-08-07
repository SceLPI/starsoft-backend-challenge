import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateOrderItemDTO {
  @IsUUID()
  itemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
