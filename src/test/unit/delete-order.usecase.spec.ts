/* eslint-disable @typescript-eslint/unbound-method */

import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { SearchService } from '../../infrastructure/elasticsearch/SearchService';
import { DeleteOrderUseCase } from '../../domain/use-cases/delete-order/DeleteOrderUseCase';

describe('Order Deletion Unity Mocked Tests', () => {
  let useCase: DeleteOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockSearchService: jest.Mocked<SearchService>;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockSearchService = {
      indexOrder: jest.fn(),
      search: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SearchService>;

    useCase = new DeleteOrderUseCase(mockOrderRepository, mockSearchService);
  });

  it('Deletion and remove from Elasticsearch', async () => {
    const id = 'order-id-123';

    await useCase.execute(id);

    expect(mockOrderRepository.delete).toHaveBeenCalledWith(id);
    expect(mockSearchService.delete).toHaveBeenCalledWith(id);
  });

  it('Show return error when order was not found', async () => {
    const id = 'erro-order';
    mockOrderRepository.delete.mockRejectedValueOnce(
      new Error('Deletion Error, Order not Found'),
    );

    await expect(useCase.execute(id)).rejects.toThrow(
      'Deletion Error, Order not Found',
    );
  });

  it('Elasticsearch Error Testing', async () => {
    const id = 'erro-es';
    mockSearchService.delete.mockRejectedValueOnce(
      new Error('Error to Remove From Elasticsearch'),
    );

    await expect(useCase.execute(id)).rejects.toThrow(
      'Error to Remove From Elasticsearch',
    );
  });
});
