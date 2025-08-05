import { Item } from './Item';

export class OrderItem {
  constructor(
    public readonly id: string,
    public item: Item,
    public quantity: number,
    public value: number,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}
}
