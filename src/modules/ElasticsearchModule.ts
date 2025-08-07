import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    NestElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: () => ({
        node: process.env.ELASTICSEARCH_NODE as string,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME as string,
          password: process.env.ELASTICSEARCH_PASSWORD as string,
        },
      }),
    }),
  ],
  exports: [NestElasticsearchModule],
})
export class ElasticsearchModule {}
