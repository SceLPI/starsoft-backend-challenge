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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDTO } from 'src/application/dtos/CreateOrderDTO';
import type { UpdateOrderDTO } from 'src/application/dtos/UpdateOrderDTO';
import { CreateOrderUseCase } from 'src/domain/use-cases/create-order/CreateOrderUseCase';
import { DeleteOrderUseCase } from 'src/domain/use-cases/delete-order/DeleteOrderUseCase';
import { FindAllOrdersUseCase } from 'src/domain/use-cases/find-all-orders/FindAllOrdersUseCase';
import { FindOrderUseCase } from 'src/domain/use-cases/find-order/FindOrderUseCase';
import { UpdateOrderUseCase } from 'src/domain/use-cases/update-order/UpdateOrderUseCase';
import { SearchService } from 'src/infrastructure/elasticsearch/SearchService';

@ApiTags('orders')
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
  @ApiOperation({ summary: 'Create a new Order and Emit an Event to Kafka' })
  @ApiBody({
    description: 'Order creation JSON',
    required: true,
    schema: {
      example: {
        items: [
          {
            itemId: 'ff78fe66-6925-4534-b387-fdd25cc99fac',
            quantity: 5,
          },
          {
            itemId: '5e9b69ca-dbe4-4e6a-8cfd-3b013e151183',
            quantity: 2,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Order Creation Completed',
  })
  @ApiResponse({
    status: 400,
    description: 'Order Creation has Failed',
  })
  async create(@Body() body: CreateOrderDTO): Promise<void> {
    await this.createOrderUseCase.execute({
      items: body.items,
      createdAt: new Date(),
    });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Id of the Order to Edit',
    example: 'a31e6aa3-3dce-4255-b57a-b325f95a7301',
  })
  @ApiOperation({ summary: 'Update order status and emit event to Kafka' })
  @ApiBody({
    description: 'Order update JSON',
    required: true,
    schema: {
      example: {
        status: 'completo',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Order Update Completed',
  })
  @ApiResponse({
    status: 400,
    description: 'Order Update has Failed',
  })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateOrderDTO,
  ): Promise<void> {
    await this.updateOrderUseCase.execute({
      id: id,
      status: body.status,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({
    name: 'id',
    description: 'Id of the Order to Delete',
    example: 'a31e6aa3-3dce-4255-b57a-b325f95a7301',
  })
  @ApiOperation({ summary: 'Order deletion' })
  @ApiResponse({
    status: 200,
    description: 'Order deletion Completed',
  })
  @ApiResponse({
    status: 400,
    description: 'Order deletion has Failed',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteOrderUseCase.execute(id);
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'q',
    description: 'Search param',
    example: '*e6a*',
  })
  @ApiOperation({ summary: 'Search an Order by Partial of Id, Status or Item' })
  @ApiResponse({
    status: 200,
    description: 'Orders List',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Search',
  })
  async search(@Query('q') q: string) {
    return this.searchService.search(q);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    description: 'Id of the Order to Retrieve',
    example: 'a31e6aa3-3dce-4255-b57a-b325f95a7301',
  })
  @ApiOperation({ summary: 'Retrieve a Specific Order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order Retrieve Completed',
    schema: {
      example: {
        id: 'a31e6aa3-3dce-4255-b57a-b325f95a7301',
        status: 'completo',
        createdAt: '2025-08-07T06:34:21.876Z',
        updatedAt: '2025-08-07T06:34:21.876Z',
        items: [
          {
            id: '4710648d-867b-4cd2-940e-d7c5b89a128c',
            item: {
              id: 'ff78fe66-6925-4534-b387-fdd25cc99fac',
              name: 'Lalala',
              price: '5.55',
              createdAt: '2025-08-07T06:34:01.103Z',
              updatedAt: '2025-08-07T06:34:01.103Z',
            },
            quantity: 10,
            value: '55.50',
            createdAt: '2025-08-07T06:34:21.876Z',
            updatedAt: '2025-08-07T06:34:21.876Z',
          },
          {
            id: '6213be22-1e79-40c1-b163-2cf78af5a948',
            item: {
              id: '5e9b69ca-dbe4-4e6a-8cfd-3b013e151183',
              name: 'Fefefe',
              price: '4.44',
              createdAt: '2025-08-07T06:34:01.103Z',
              updatedAt: '2025-08-07T06:34:01.103Z',
            },
            quantity: 10,
            value: '44.40',
            createdAt: '2025-08-07T06:34:21.876Z',
            updatedAt: '2025-08-07T06:34:21.876Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Order Creation has Failed',
  })
  async findById(@Param('id') id: string) {
    return this.findOrderUseCase.execute(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all Orders' })
  @ApiResponse({
    status: 200,
    description: 'Order Retrieve Completed',
    schema: {
      example: [
        {
          id: 'a31e6aa3-3dce-4255-b57a-b325f95a7301',
          status: 'completo',
          createdAt: '2025-08-07T06:34:21.876Z',
          updatedAt: '2025-08-07T06:34:21.876Z',
          items: [
            {
              id: '4710648d-867b-4cd2-940e-d7c5b89a128c',
              item: {
                id: 'ff78fe66-6925-4534-b387-fdd25cc99fac',
                name: 'Lalala',
                price: '5.55',
                createdAt: '2025-08-07T06:34:01.103Z',
                updatedAt: '2025-08-07T06:34:01.103Z',
              },
              quantity: 10,
              value: '55.50',
              createdAt: '2025-08-07T06:34:21.876Z',
              updatedAt: '2025-08-07T06:34:21.876Z',
            },
            {
              id: '6213be22-1e79-40c1-b163-2cf78af5a948',
              item: {
                id: '5e9b69ca-dbe4-4e6a-8cfd-3b013e151183',
                name: 'Fefefe',
                price: '4.44',
                createdAt: '2025-08-07T06:34:01.103Z',
                updatedAt: '2025-08-07T06:34:01.103Z',
              },
              quantity: 10,
              value: '44.40',
              createdAt: '2025-08-07T06:34:21.876Z',
              updatedAt: '2025-08-07T06:34:21.876Z',
            },
          ],
        },
        {
          id: '2680c3da-f65a-45d4-ae4d-5d367508a735',
          status: 'pendente',
          createdAt: '2025-08-07T06:38:19.114Z',
          updatedAt: '2025-08-07T06:38:19.114Z',
          items: [
            {
              id: '986ecc1e-cd17-4ce4-866f-d4630b58b5cc',
              item: {
                id: 'ff78fe66-6925-4534-b387-fdd25cc99fac',
                name: 'Lalala',
                price: '5.55',
                createdAt: '2025-08-07T06:34:01.103Z',
                updatedAt: '2025-08-07T06:34:01.103Z',
              },
              quantity: 10,
              value: '55.50',
              createdAt: '2025-08-07T06:38:19.114Z',
              updatedAt: '2025-08-07T06:38:19.114Z',
            },
            {
              id: '22dd6376-cf2a-413a-a413-b1b5106bb00d',
              item: {
                id: '5e9b69ca-dbe4-4e6a-8cfd-3b013e151183',
                name: 'Fefefe',
                price: '4.44',
                createdAt: '2025-08-07T06:34:01.103Z',
                updatedAt: '2025-08-07T06:34:01.103Z',
              },
              quantity: 10,
              value: '44.40',
              createdAt: '2025-08-07T06:38:19.114Z',
              updatedAt: '2025-08-07T06:38:19.114Z',
            },
          ],
        },
      ],
    },
  })
  async findAll() {
    return this.findAllOrdersUseCase.execute();
  }
}
