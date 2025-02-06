import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfirmChannel } from 'amqplib';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);

  constructor() {
    const connection = amqp.connect(['amqp://admin:admin@localhost']);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('emailQueue', { durable: true }); // Cola persistente

        await channel.consume('emailQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString());
            this.logger.log('Received message:', content.email);
            // Lógica para procesar el email aquí
            channel.ack(message);
          }
        });
      });

      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
