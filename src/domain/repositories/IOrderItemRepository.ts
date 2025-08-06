import { OrderItem } from '../entities/OrderItem';

export interface IOrderItemRepository {
  findById(id: string): Promise<OrderItem | null>;
  findByOrderId(orderId: string): Promise<OrderItem[]>;
  save(orderItem: OrderItem): Promise<void>;
  deleteByOrderId(orderId: string): Promise<void>;
}
