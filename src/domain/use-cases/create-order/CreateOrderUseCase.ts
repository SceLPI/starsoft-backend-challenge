import { ICreateOrderUseCase } from './ICreateOrderUseCase';
import { CreateOrderUseCaseParams } from './CreateOrderUseCaseParams';

import { IItemRepository } from '../../repositories/IItemRepository';
import { IOrderRepository } from '../../repositories/IOrderRepository';

import { Order } from '../../entities/Order';
import { OrderItem } from '../../entities/OrderItem';
import { Status } from '../../enums/Status';
import { randomUUID } from 'crypto';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';
import { KafkaService } from 'src/infrastructure/kafka/KafkaService';

export class CreateOrderUseCase implements ICreateOrderUseCase {
  constructor(
    private readonly itemRepository: IItemRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly searchService: SearchService,
    private readonly kafkaService: KafkaService,
  ) {}

  async execute(params: CreateOrderUseCaseParams): Promise<Order> {
    const { items, createdAt } = params;

    const orderItems: OrderItem[] = [];

    for (const { itemId, quantity } of items) {
      const item = await this.itemRepository.findById(itemId);
      if (!item) {
        throw new Error(`Item not found: ${itemId}`);
      }

      const value = item.price * quantity;

      const orderItem = new OrderItem(
        randomUUID(),
        item,
        quantity,
        value,
        createdAt,
        createdAt,
      );

      orderItems.push(orderItem);
    }

    const order = new Order(
      randomUUID(),
      Status.PENDING,
      createdAt,
      createdAt,
      orderItems,
    );

    await this.orderRepository.save(order);
    await this.searchService.indexOrder(order);

    const orderEmitter = {
      id: order.id,
      status: order.status,
      items: order.items.map((orderItems) => {
        return {
          id: orderItems.id,
          name: orderItems.item.name,
          quantity: orderItems.quantity,
          unitValue: orderItems.item.price,
          value: orderItems.value,
        };
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };

    await this.kafkaService.emit('order_created', orderEmitter);

    return order;
  }
}
