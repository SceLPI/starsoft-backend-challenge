import { Global, Module } from '@nestjs/common';
import { KafkaService } from 'src/infrastructure/kafka/KafkaService';

@Global()
@Module({
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
