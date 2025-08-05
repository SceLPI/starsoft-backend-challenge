import { Status } from '../enums/Status';
import { OrderItem } from './OrderItem';

export class Order {
  constructor(
    public readonly id: string,
    public status: Status,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public readonly items: OrderItem[],
  ) {}

  updateStatus(status: Status): void {
    this.status = status;
    this.updatedAt = new Date();
  }
}
