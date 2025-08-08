/* eslint-disable @typescript-eslint/unbound-method */

import { Order } from '../domain/entities/Order';
import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { FindAllOrdersUseCase } from '../domain/use-cases/find-all-orders/FindAllOrdersUseCase';
import { Status } from '../domain/enums/Status';

describe('Order Creation Unity Mocked Tests', () => {
  let useCase: FindAllOrdersUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindAllOrdersUseCase(mockOrderRepository);
  });

  it('Should Return all Order Repositories', async () => {
    const fakeOrders: Order[] = [
      new Order('id-1', Status.PENDING, new Date(), new Date(), []),
      new Order('id-2', Status.PROCESSING, new Date(), new Date(), []),
    ];

    mockOrderRepository.findAll.mockResolvedValue(fakeOrders);

    const result = await useCase.execute();

    expect(mockOrderRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(fakeOrders);
  });
});
