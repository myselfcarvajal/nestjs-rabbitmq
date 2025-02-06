import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ProducerService.name);

  constructor() {
    const connection = amqp.connect(['amqp://admin:admin@localhost']);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('emailQueue', { durable: true }); // Cola persistente
      },
    });
  }

  async addToEmailQueue(email: string) {
    try {
      await this.channelWrapper.sendToQueue(
        'emailQueue',
        Buffer.from(JSON.stringify({ email })), // Se envía como objeto JSON
        {
          persistent: true, // Mensaje persistente
        },
      );
      this.logger.log('Sent To Queue:', email);
    } catch (error) {
      throw new HttpException(
        `Error adding mail to queue: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
