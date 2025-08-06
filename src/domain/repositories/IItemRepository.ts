import { Item } from '../entities/Item';

export interface IItemRepository {
  findById(id: string): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  save(item: Item): Promise<void>;
  update(item: Item): Promise<void>;
  delete(id: string): Promise<void>;
}
