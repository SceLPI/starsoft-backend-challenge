import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { OrderEntity } from '../entities/OrderEntity';
import { OrderItemEntity } from '../entities/OrderItemEntity';
import { ItemEntity } from '../entities/ItemEntity';
import { Order } from '../../../domain/entities/Order';
import { Status } from '../../../domain/enums/Status';
import { OrderItem } from 'src/domain/entities/OrderItem';

@Injectable()
export class DBOrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async save(order: Order): Promise<void> {
    const orderEntity = this.orderRepository.create({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });

    const savedOrder = await this.orderRepository.save(orderEntity);

    const orderItemEntities: OrderItemEntity[] = order.items.map(
      (orderItem: OrderItem) => {
        const itemEntity: ItemEntity = {
          id: orderItem.item.id,
          name: orderItem.item.name,
          price: orderItem.item.price,
          createdAt: orderItem.item.createdAt,
          updatedAt: orderItem.item.updatedAt,
        };

        const orderItemEntity: OrderItemEntity =
          this.orderItemRepository.create({
            id: orderItem.id,
            item: itemEntity,
            order: savedOrder,
            quantity: orderItem.quantity,
            value: orderItem.value,
            createdAt: orderItem.createdAt,
            updatedAt: orderItem.updatedAt,
          });

        return orderItemEntity;
      },
    );

    await this.orderItemRepository.save(orderItemEntities);
  }

  async findById(id: string): Promise<Order | null> {
    const entity = await this.orderRepository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findAll(): Promise<Order[]> {
    const entities = await this.orderRepository.find();
    return entities.map((entity) => this.toDomain(entity));
  }

  async update(order: Order): Promise<void> {
    const entity = this.toEntity(order);
    await this.orderRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.delete(id);
  }

  private toDomain(entity: OrderEntity): Order {
    return new Order(
      entity.id,
      entity.status as Status,
      entity.createdAt,
      entity.updatedAt,
      entity.items.map((orderItem) => ({
        id: orderItem.id,
        item: orderItem.item,
        quantity: orderItem.quantity,
        value: orderItem.value,
        createdAt: orderItem.createdAt,
        updatedAt: orderItem.updatedAt,
      })),
    );
  }

  private toEntity(order: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = order.id;
    entity.status = order.status as string;
    entity.createdAt = order.createdAt;
    entity.updatedAt = order.updatedAt;

    entity.items = order.items.map((orderItem) => {
      const itemEntity = new ItemEntity();
      itemEntity.id = orderItem.item.id;
      itemEntity.name = orderItem.item.name;
      itemEntity.price = orderItem.item.price;
      itemEntity.createdAt = orderItem.item.createdAt;
      itemEntity.updatedAt = orderItem.item.updatedAt;

      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.id = orderItem.id;
      orderItemEntity.item = itemEntity;
      orderItemEntity.quantity = orderItem.quantity;
      orderItemEntity.value = orderItem.value;
      orderItemEntity.createdAt = orderItem.createdAt;
      orderItemEntity.updatedAt = orderItem.updatedAt;
      return orderItemEntity;
    });

    return entity;
  }
}
