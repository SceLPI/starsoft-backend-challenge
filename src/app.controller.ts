import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get API Status' })
  @ApiResponse({
    status: 200,
    description: 'API Status Page',
  })
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('/debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }
}
