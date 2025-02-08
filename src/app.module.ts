import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProducerModule, ConsumerModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
