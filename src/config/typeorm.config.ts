import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: (process.env.DB_HOST as string) ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432') ?? 5432,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  synchronize: false,
  autoLoadEntities: true,
});
