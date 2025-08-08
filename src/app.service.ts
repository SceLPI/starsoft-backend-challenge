import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      apiVersion: '1.0.0',
      apiStatus: 'active',
      database: 'active',
      elasticSearch: 'active',
      kafkaUi: 'http://localhost:8080',
    };
  }
}
