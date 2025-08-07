import { IUpdateOrderUseCase } from './IUpdateOrderUseCase';
import { UpdateOrderUseCaseParams } from './UpdateOrderUseCaseParams';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';
import { KafkaService } from 'src/infrastructure/kafka/KafkaService';

export class UpdateOrderUseCase implements IUpdateOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly searchService: SearchService,
    private readonly kafkaService: KafkaService,
  ) {}

  async execute(params: UpdateOrderUseCaseParams): Promise<void> {
    const { id, status } = params;

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order not found: ${id}`);
    }

    const orderPreviewStatus = order.status;

    order.updateStatus(status);
    await this.orderRepository.update(order);
    await this.searchService.indexOrder(order);

    const orderEmitter = {
      id: order.id,
      status: order.status,
      previewStatus: orderPreviewStatus,
      updatedAt: new Date().toISOString(),
    };

    await this.kafkaService.emit('order_status_updated', orderEmitter);
  }
}
