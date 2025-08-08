/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { SearchService } from '../infrastructure/elasticsearch/SearchService';
import { DeleteOrderUseCase } from '../domain/use-cases/delete-order/DeleteOrderUseCase';

describe('Order Creation Unity Mocked Tests', () => {
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
    } as Partial<jest.Mocked<SearchService>>;

    useCase = new DeleteOrderUseCase(mockOrderRepository, mockSearchService);
  });

  it('deve deletar a ordem e removê-la do Elasticsearch', async () => {
    const id = 'order-id-123';

    await useCase.execute(id);

    expect(mockOrderRepository.delete).toHaveBeenCalledWith(id);
    expect(mockSearchService.delete).toHaveBeenCalledWith(id);
  });

  it('deve propagar erros do repositório', async () => {
    const id = 'erro-order';
    mockOrderRepository.delete.mockRejectedValueOnce(
      new Error('Erro no delete'),
    );

    await expect(useCase.execute(id)).rejects.toThrow('Erro no delete');
  });

  it('deve propagar erros do Elasticsearch', async () => {
    const id = 'erro-es';
    mockSearchService.delete.mockRejectedValueOnce(
      new Error('Erro ao remover do Elasticsearch'),
    );

    await expect(useCase.execute(id)).rejects.toThrow(
      'Erro ao remover do Elasticsearch',
    );
  });
});
