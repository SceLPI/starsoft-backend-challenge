import { IUpdateOrderUseCase } from './IUpdateOrderUseCase';
import { UpdateOrderUseCaseParams } from './UpdateOrderUseCaseParams';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';

export class UpdateOrderUseCase implements IUpdateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly searchService: SearchService,
  ) {}

  async execute(params: UpdateOrderUseCaseParams): Promise<void> {
    const { id, status } = params;

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order not found: ${id}`);
    }

    order.updateStatus(status);
    await this.orderRepository.update(order);
    await this.searchService.indexOrder(order);
  }
}
