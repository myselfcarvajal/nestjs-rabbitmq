import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ProducerService } from './producer/producer.service';

@Controller()
export class AppController {
  constructor(private producerService: ProducerService) {}

  @Post()
  addToEmailQueue(@Body('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }

    return this.producerService.addToEmailQueue(email);
  }
}
