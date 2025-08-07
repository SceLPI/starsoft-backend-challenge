import { IFindAllOrdersUseCase } from './IFindAllOrdersUseCase';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { Order } from '../../entities/Order';

export class FindAllOrdersUseCase implements IFindAllOrdersUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
