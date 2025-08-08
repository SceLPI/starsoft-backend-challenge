import { Order } from 'src/domain/entities/Order';
import { CreateOrderUseCaseParams } from './CreateOrderUseCaseParams';

export interface ICreateOrderUseCase {
  execute(params: CreateOrderUseCaseParams): Promise<Order>;
}
