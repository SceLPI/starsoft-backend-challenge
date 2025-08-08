/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Status } from '../../domain/enums/Status';
import { Item } from '../../domain/entities/Item';
import { IOrderRepository } from '../../domain/repositories/IOrderRepository';
import { SearchService } from '../../infrastructure/elasticsearch/SearchService';
import { KafkaService } from '../../infrastructure/kafka/KafkaService';
import { UpdateOrderUseCaseParams } from '../../domain/use-cases/update-order/UpdateOrderUseCaseParams';
import { Order } from '../../domain/entities/Order';
import { OrderItem } from '../../domain/entities/OrderItem';
import { UpdateOrderUseCase } from '../../domain/use-cases/update-order/UpdateOrderUseCase';

describe('Order Creation Unity Mocked Tests', () => {
  let useCase: UpdateOrderUseCase;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;
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

    mockSearchService = {
      indexOrder: jest.fn(),
      search: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<SearchService>;

    mockKafkaService = {
      emit: jest.fn(),
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn(),
    } as unknown as jest.Mocked<KafkaService>;

    useCase = new UpdateOrderUseCase(
      mockOrderRepository,
      mockSearchService,
      mockKafkaService,
    );
  });

  it('Updating an Existing Order and Sending it to Kafka', async () => {
    const input: UpdateOrderUseCaseParams = {
      id: 'order-1',
      status: Status.CANCELLED,
    };

    mockOrderRepository.findById.mockImplementation(async (id: string) => {
      return new Order(id, Status.PENDING, new Date(), new Date(), [
        new OrderItem(
          'order-item-1',
          new Item('item-1', 'item-1', 10, new Date(), new Date()),
          5,
          50,
          new Date(),
          new Date(),
        ),
      ]);
    });

    await useCase.execute(input);

    //FIND BY ORDER BY ID SHOULD BE CALLED ONCE
    expect(mockOrderRepository.findById).toHaveBeenCalled();
    //ORDER UPDATE SHOULD BE CALLED ONCE
    expect(mockOrderRepository.update).toHaveBeenCalled();
    //CHECK IF ELASTIC SEARCH UPDATE WAS CALLED
    expect(mockSearchService.indexOrder).toHaveBeenCalled();
    //CHECK IF KAFKA WAS CALLED EMITTING order_status_updated
    expect(mockKafkaService.emit).toHaveBeenCalledWith(
      'order_status_updated',
      expect.objectContaining({
        status: expect.any(String),
      }),
    );
  });

  it('Updating With a Wrong Order Id', async () => {
    const input: UpdateOrderUseCaseParams = {
      id: 'order-1',
      status: Status.CANCELLED,
    };

    mockOrderRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(
      `Order not found: ${input.id}`,
    );
  });
});
