import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

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
