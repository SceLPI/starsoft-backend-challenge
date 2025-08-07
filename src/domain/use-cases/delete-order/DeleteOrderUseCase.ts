import { IDeleteOrderUseCase } from './IDeleteOrderUseCase';
import { IOrderRepository } from '../../repositories/IOrderRepository';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';

export class DeleteOrderUseCase implements IDeleteOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly searchService: SearchService,
  ) {}

  async execute(id: string): Promise<void> {
    await this.orderRepository.delete(id);
    await this.searchService.delete(id);
  }
}
