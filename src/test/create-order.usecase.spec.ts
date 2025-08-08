/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Item } from '../domain/entities/Item';
import { IItemRepository } from '../domain/repositories/IItemRepository';
import { IOrderRepository } from '../domain/repositories/IOrderRepository';
import { CreateOrderUseCase } from '../domain/use-cases/create-order/CreateOrderUseCase';
import { CreateOrderUseCaseParams } from '../domain/use-cases/create-order/CreateOrderUseCaseParams';
import { SearchService } from '../infrastructure/elasticsearch/SearchService';
import { KafkaService } from '../infrastructure/kafka/KafkaService';

describe('Order Creation Unity Mocked Tests', () => {
  let useCase: CreateOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
  let mockItemRepository: jest.Mocked<IItemRepository>;
  let mockSearchService: jest.Mocked<SearchService>;
  let mockKafkaService: jest.Mocked<KafkaService>;

  beforeEach(() => {
    mockOrderRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockItemRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IItemRepository>;

    mockSearchService = {
      indexOrder: jest.fn(),
      search: jest.fn(),
      delete: jest.fn(),
    } as Partial<jest.Mocked<SearchService>>;

    mockKafkaService = {
      emit: jest.fn(),
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as Partial<jest.Mocked<KafkaService>>;

    useCase = new CreateOrderUseCase(
      mockItemRepository,
      mockOrderRepository,
      mockSearchService,
      mockKafkaService,
    );
  });

  it('Creating a new Order and Sending it to Kafka', async () => {
    const input: CreateOrderUseCaseParams = {
      items: [
        { itemId: 'item-1', quantity: 1 },
        { itemId: 'item-2', quantity: 2 },
      ],
      createdAt: new Date(),
    };

    mockItemRepository.findById.mockImplementation(async (id: string) => {
      return new Item(id, 'bbbbb', 10, new Date(), new Date());
    });

    await useCase.execute(input);
    //FIND BY ID SHOULD BE CALLED NUMBER OF ITEMS WE GOT
    expect(mockItemRepository.findById).toHaveBeenCalledTimes(
      input.items.length,
    );
    //ORDER SAVE TEST
    expect(mockOrderRepository.save).toHaveBeenCalled();
    //CHECK IF ELASTIC SEARCH INSERTION WAS CALLED
    expect(mockSearchService.indexOrder).toHaveBeenCalled();
    //CHECK IF KAFKA WAS CALLED EMITTING order_created
    expect(mockKafkaService.emit).toHaveBeenCalledWith(
      'order_created',
      expect.objectContaining({
        id: expect.any(String),
        status: expect.any(String),
        items: expect.any(Array),
      }),
    );
  });

  it('Creating a new With Wrong Item', async () => {
    const input: CreateOrderUseCaseParams = {
      items: [
        { itemId: 'item-1', quantity: 1 },
        { itemId: 'item-2', quantity: 2 },
      ],
      createdAt: new Date(),
    };

    mockItemRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      `Item not found: ${input.items[0].itemId}`,
    );
  });
});
