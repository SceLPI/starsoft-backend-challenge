import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  async onModuleInit() {
    const clientId = process.env.KAFKA_CLIENT_ID;
    const brokers = [`${process.env.KAFKA_BROKER}`];
    this.kafka = new Kafka({
      clientId,
      brokers,
    });

    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
