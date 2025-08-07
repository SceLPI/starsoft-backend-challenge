import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order/CreateOrderUseCase';
import { UpdateOrderUseCase } from 'src/domain/use-cases/update-order/UpdateOrderUseCase';
import { ItemEntity } from 'src/infrastructure/database/entities/ItemEntity';
import { OrderEntity } from 'src/infrastructure/database/entities/OrderEntity';
import { OrderItemEntity } from 'src/infrastructure/database/entities/OrderItemEntity';
import { DBItemRepository } from 'src/infrastructure/database/repositories/DBItemRepository';
import { DBOrderRepository } from 'src/infrastructure/database/repositories/DBOrderRepository';
import { OrderController } from 'src/presentation/controllers/OrderController';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity, OrderEntity, OrderItemEntity]),
  ],
  controllers: [OrderController],
  providers: [
    DBItemRepository,
    DBOrderRepository,
    {
      provide: CreateOrderUseCase,
      useFactory: (
        itemRepository: DBItemRepository,
        orderRepository: DBOrderRepository,
      ) => new CreateOrderUseCase(itemRepository, orderRepository),
      inject: [DBItemRepository, DBOrderRepository],
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: (orderRepository: DBOrderRepository) =>
        new UpdateOrderUseCase(orderRepository),
      inject: [DBOrderRepository, DBItemRepository],
    },
  ],
})
export class OrderModule {}
