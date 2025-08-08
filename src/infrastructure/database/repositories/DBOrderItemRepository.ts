import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItemEntity } from '../entities/OrderItemEntity';
import { ItemEntity } from '../entities/ItemEntity';
import { OrderItem } from '../../../domain/entities/OrderItem';
import { IOrderItemRepository } from '../../../domain/repositories/IOrderItemRepository';

@Injectable()
export class DBOrderItemRepository implements IOrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly orderItemRepository: Repository<OrderItemEntity>,
  ) {}

  async findById(id: string): Promise<OrderItem | null> {
    const entity = await this.orderItemRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const entities = await this.orderItemRepository.find({
      where: { order: { id: orderId } },
    });
    return entities.map((entity) => this.toDomain(entity)); // evita unbound method
  }

  async save(orderItem: OrderItem): Promise<void> {
    await this.orderItemRepository.save(this.toEntity(orderItem));
  }

  async deleteByOrderId(orderId: string): Promise<void> {
    await this.orderItemRepository.delete({ order: { id: orderId } });
  }

  private toDomain(entity: OrderItemEntity): OrderItem {
    return new OrderItem(
      entity.id,
      {
        id: entity.item.id,
        name: entity.item.name,
        price: entity.item.price,
        createdAt: entity.item.createdAt,
        updatedAt: entity.item.updatedAt,
      },
      entity.quantity,
      entity.value,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private toEntity(domain: OrderItem): OrderItemEntity {
    const itemEntity = new ItemEntity();
    itemEntity.id = domain.item.id;
    itemEntity.name = domain.item.name;
    itemEntity.price = domain.item.price;
    itemEntity.createdAt = domain.item.createdAt;
    itemEntity.updatedAt = domain.item.updatedAt;

    const entity = new OrderItemEntity();
    entity.id = domain.id;
    entity.item = itemEntity;
    entity.quantity = domain.quantity;
    entity.value = domain.value;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }
}
