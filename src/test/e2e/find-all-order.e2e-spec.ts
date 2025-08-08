/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import 'jest-extended';
import { KafkaService } from 'src/infrastructure/kafka/KafkaService';

describe('OrderController e2e - FindOrder', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const mockKafkaService = {
      emit: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KafkaService)
      .useValue(mockKafkaService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({}));

    await app.init();
    dataSource = app.get(DataSource);

    await dataSource.query(
      'TRUNCATE TABLE "order_items" RESTART IDENTITY CASCADE',
    );
    await dataSource.query('TRUNCATE TABLE "orders" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "items" RESTART IDENTITY CASCADE');
    await dataSource.query(
      `INSERT INTO items (id, name, price, created_at, updated_at) ` +
        `VALUES ('ff78fe66-6925-4534-b387-fdd25cc99fac', 'ITEM1', 4.44, NOW(), NOW()), ` +
        `('5e9b69ca-dbe4-4e6a-8cfd-3b013e151183', 'ITEM2', 5.55, NOW(), NOW()) `,
    );
    await dataSource.query(
      `INSERT INTO orders (id, status, created_at, updated_at) ` +
        `VALUES ('fa23d1b8-41ea-4adf-830e-36743321cb94', 'pendente', NOW(), NOW()) `,
    );
    await dataSource.query(
      `INSERT INTO order_items (id, quantity, value, created_at, updated_at, order_id, item_id) ` +
        `VALUES ('36f53999-fd49-46f4-af1d-7ad7892ddea9', '2', 8.88, NOW(), NOW(), 'fa23d1b8-41ea-4adf-830e-36743321cb94', 'ff78fe66-6925-4534-b387-fdd25cc99fac') `,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('/order/ (GET) - Should Find all Orders', async () => {
    const orderId = 'fa23d1b8-41ea-4adf-830e-36743321cb94';
    const server = app.getHttpServer();

    const response = await request(server).get(`/order`).send().expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    const found = response.body.find((order: any) => order.id === orderId);

    expect(found).toBeDefined();
  });
});
