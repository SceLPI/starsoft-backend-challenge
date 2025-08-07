import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order/CreateOrderUseCase';
import { DeleteOrderUseCase } from 'src/domain/use-cases/delete-order/DeleteOrderUseCase';
import { FindAllOrdersUseCase } from 'src/domain/use-cases/find-all-orders/FindAllOrdersUseCase';
import { FindOrderUseCase } from 'src/domain/use-cases/find-order/FindOrderUseCase';
import { UpdateOrderUseCase } from 'src/domain/use-cases/update-order/UpdateOrderUseCase';
import { ItemEntity } from 'src/infrastructure/database/entities/ItemEntity';
import { OrderEntity } from 'src/infrastructure/database/entities/OrderEntity';
import { OrderItemEntity } from 'src/infrastructure/database/entities/OrderItemEntity';
import { DBItemRepository } from 'src/infrastructure/database/repositories/DBItemRepository';
import { DBOrderRepository } from 'src/infrastructure/database/repositories/DBOrderRepository';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';
import { OrderController } from 'src/presentation/controllers/OrderController';
import { ElasticsearchModule } from './ElasticsearchModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, OrderEntity, OrderItemEntity]),
    ElasticsearchModule,
  ],
  controllers: [OrderController],
  providers: [
    DBItemRepository,
    DBOrderRepository,
    SearchService,
    {
      provide: CreateOrderUseCase,
      useFactory: (
        itemRepository: DBItemRepository,
        orderRepository: DBOrderRepository,
        searchService: SearchService,
      ) =>
        new CreateOrderUseCase(itemRepository, orderRepository, searchService),
      inject: [DBItemRepository, DBOrderRepository, SearchService],
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: (
        orderRepository: DBOrderRepository,
        searchService: SearchService,
      ) => new UpdateOrderUseCase(orderRepository, searchService),
      inject: [DBOrderRepository, SearchService],
    },
    {
      provide: DeleteOrderUseCase,
      useFactory: (
        orderRepository: DBOrderRepository,
        searchService: SearchService,
      ) => new DeleteOrderUseCase(orderRepository, searchService),
      inject: [DBOrderRepository, SearchService],
    },
    {
      provide: FindOrderUseCase,
      useFactory: (orderRepository: DBOrderRepository) =>
        new FindOrderUseCase(orderRepository),
      inject: [DBOrderRepository],
    },
    {
      provide: FindAllOrdersUseCase,
      useFactory: (orderRepository: DBOrderRepository) =>
        new FindAllOrdersUseCase(orderRepository),
      inject: [DBOrderRepository],
    },
  ],
})
export class OrderModule {}
