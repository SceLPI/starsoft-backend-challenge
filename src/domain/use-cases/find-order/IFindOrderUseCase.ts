import { Order } from 'src/domain/entities/Order';

export interface IFindOrderUseCase {
  execute(id: string): Promise<Order | null>;
}
