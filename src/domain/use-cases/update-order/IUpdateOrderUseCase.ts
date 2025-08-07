import { UpdateOrderUseCaseParams } from './UpdateOrderUseCaseParams';

export interface IUpdateOrderUseCase {
  execute(params: UpdateOrderUseCaseParams): Promise<void>;
}
