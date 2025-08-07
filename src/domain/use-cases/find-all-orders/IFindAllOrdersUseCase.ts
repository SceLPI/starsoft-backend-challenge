import { Order } from 'src/domain/entities/Order';

export interface IFindAllOrdersUseCase {
  execute(): Promise<Order[]>;
}
