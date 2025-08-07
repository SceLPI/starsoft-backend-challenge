import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

const test = new ConfigService({});
console.log(test.get('DB_HOST'));
console.log(test.get('DB_PORT'));
console.log(test.get('DB_USER'));
console.log(test.get('DB_PASS'));
console.log(test.get('DB_NAME'));

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: (configService.get('DB_HOST') as string) ?? 'localhost',
  port: parseInt(configService.get('DB_PORT') ?? '5432'),
  username: configService.get('DB_USER') as string,
  password: configService.get('DB_PASS') as string,
  database: configService.get('DB_NAME') as string,
  synchronize: false,
  autoLoadEntities: true,
});
