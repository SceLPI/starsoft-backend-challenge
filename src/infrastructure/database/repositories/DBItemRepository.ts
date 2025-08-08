import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IItemRepository } from '../../../domain/repositories/IItemRepository';
import { ItemEntity } from '../entities/ItemEntity';
import { Item } from '../../../domain/entities/Item';

@Injectable()
export class DBItemRepository implements IItemRepository {
  constructor(
    /* istanbul ignore next */
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
  ) {}

  async findById(id: string): Promise<Item | null> {
    const entity = await this.itemRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  /* istanbul ignore next */
  async findAll(): Promise<Item[]> {
    const entities = await this.itemRepository.find();
    return entities.map((entity) => this.toDomain(entity)); // ← evita unbound method
  }

  /* istanbul ignore next */
  async save(item: Item): Promise<void> {
    await this.itemRepository.save(this.toEntity(item));
  }

  /* istanbul ignore next */
  async update(item: Item): Promise<void> {
    await this.itemRepository.save(this.toEntity(item));
  }

  /* istanbul ignore next */
  async delete(id: string): Promise<void> {
    await this.itemRepository.delete(id);
  }

  private toDomain(entity: ItemEntity): Item {
    return new Item(
      entity.id,
      entity.name,
      entity.price,
      entity.updatedAt,
      entity.createdAt,
    );
  }

  /* istanbul ignore next */
  private toEntity(domain: Item): ItemEntity {
    const entity = new ItemEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.price = domain.price;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
