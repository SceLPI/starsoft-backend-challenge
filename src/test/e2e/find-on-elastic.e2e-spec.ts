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

describe('OrderController e2e - Search', () => {
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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/order/search/?q=*a* (GET) - Should Find an Order With *a* on Its ID, Status Or Item', async () => {
    const query = '*a*';

    const server = app.getHttpServer();

    await request(server).get(`/order/search?q=${query}`).send().expect(200);
  });
});
