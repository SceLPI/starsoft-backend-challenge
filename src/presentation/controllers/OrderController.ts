/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { UpdateOrderDTO } from 'src/application/dtos/UpdateOrderDTO';
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order/CreateOrderUseCase';
import { DeleteOrderUseCase } from 'src/domain/use-cases/delete-order/DeleteOrderUseCase';
import { FindAllOrdersUseCase } from 'src/domain/use-cases/find-all-orders/FindAllOrdersUseCase';
import { FindOrderUseCase } from 'src/domain/use-cases/find-order/FindOrderUseCase';
import { UpdateOrderUseCase } from 'src/domain/use-cases/update-order/UpdateOrderUseCase';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';

@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
    private readonly findOrderUseCase: FindOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly searchService: SearchService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any): Promise<void> {
    console.log(JSON.stringify(body, null, 2));
    await this.createOrderUseCase.execute({
      items: body.items,
      createdAt: new Date(),
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateOrderDTO,
  ): Promise<void> {
    console.log(JSON.stringify(body));
    await this.updateOrderUseCase.execute({
      id: id,
      status: body.status,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteOrderUseCase.execute(id);
  }

  @Get('/search')
  async search(@Query('q') q: string) {
    return this.searchService.search(q);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.findOrderUseCase.execute(id);
  }

  @Get()
  async findAll() {
    return this.findAllOrdersUseCase.execute();
  }
}
