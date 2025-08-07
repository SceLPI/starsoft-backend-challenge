import { CreateOrderUseCaseParams } from './CreateOrderUseCaseParams';

export interface ICreateOrderUseCase {
  execute(params: CreateOrderUseCaseParams): Promise<void>;
}
