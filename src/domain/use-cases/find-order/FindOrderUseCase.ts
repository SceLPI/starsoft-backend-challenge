import { IFindOrderUseCase } from './IFindOrderUseCase';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { Order } from '../../entities/Order';

export class FindOrderUseCase implements IFindOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }
}
