import { validate } from '@nestjs/class-validator';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import type { CreateOrderDTO } from 'src/application/dtos/CreateOrderDTO';
import type { UpdateOrderDTO } from 'src/application/dtos/UpdateOrderDTO';
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order/CreateOrderUseCase';
import { UpdateOrderUseCase } from 'src/domain/use-cases/update-order/UpdateOrderUseCase';

@Controller('order')
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateOrderDTO): Promise<void> {
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
    await this.updateOrderUseCase.execute({
      id: id,
      status: body.status,
    });
  }
}
