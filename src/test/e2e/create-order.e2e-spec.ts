/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { KafkaService } from 'src/infrastructure/kafka/KafkaService';
import 'jest-extended';

describe('OrderController e2e - CREATE', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/order (POST) - should create a new order', async () => {
    const item1Id = 'ff78fe66-6925-4534-b387-fdd25cc99fac';
    const item2Id = '5e9b69ca-dbe4-4e6a-8cfd-3b013e151183';

    const payload = {
      items: [
        { itemId: item1Id, quantity: 3 },
        { itemId: item2Id, quantity: 2 },
      ],
    };

    const server = app.getHttpServer();

    const response = await request(server)
      .post('/order')
      .send(payload)
      .expect(201);

    expect(response.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('/order (POST) - Should Fail to Create a new Order', async () => {
    const item1Id = '44c1ef5d-5763-422f-86e9-7a04e7594ede';

    const payload = {
      items: [{ itemId: item1Id, quantity: 3 }],
    };

    const server = app.getHttpServer();

    const response = await request(server)
      .post('/order')
      .send(payload)
      .expect(400);
    expect(response.body).toStrictEqual({
      error: 'Bad Request',
      message: `Item not found: ${item1Id}`,
      statusCode: 400,
    });
  });
});
