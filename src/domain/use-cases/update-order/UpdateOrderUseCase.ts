import { IUpdateOrderUseCase } from './IUpdateOrderUseCase';
import { UpdateOrderUseCaseParams } from './UpdateOrderUseCaseParams';
import { IOrderRepository } from '../../repositories/IOrderRepository';

export class UpdateOrderUseCase implements IUpdateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(params: UpdateOrderUseCaseParams): Promise<void> {
    const { id, status } = params;

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order not found: ${id}`);
    }

    order.updateStatus(status);
    await this.orderRepository.update(order);
  }
}
