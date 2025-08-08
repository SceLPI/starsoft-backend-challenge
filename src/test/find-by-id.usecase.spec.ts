/* eslint-disable @typescript-eslint/unbound-method */

import { Order } from '../domain/entities/Order';
import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { Status } from '../domain/enums/Status';
import { FindOrderUseCase } from '../domain/use-cases/find-order/FindOrderUseCase';

describe('Order Creation Unity Mocked Tests', () => {
  let useCase: FindOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new FindOrderUseCase(mockOrderRepository);
  });

  it('Should Return an Existing Order', async () => {
    const fakeOrder = new Order(
      'order-id-123',
      Status.PENDING,
      new Date(),
      new Date(),
      [],
    );

    mockOrderRepository.findById.mockResolvedValue(fakeOrder);

    const result = await useCase.execute('order-id-123');

    expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-id-123');
    expect(result).toEqual(fakeOrder);
  });

  it('Should Return Null When Order Does not Exists', async () => {
    mockOrderRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(mockOrderRepository.findById).toHaveBeenCalledWith(
      'non-existent-id',
    );
    expect(result).toBeNull();
  });
});
