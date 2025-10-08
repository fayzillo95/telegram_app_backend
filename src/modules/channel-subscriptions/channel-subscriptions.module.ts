import { Module } from '@nestjs/common';
import { ChannelSubscriptionsService } from './channel-subscriptions.service';
import { ChannelSubscriptionsController } from './channel-subscriptions.controller';

@Module({
  controllers: [ChannelSubscriptionsController],
  providers: [ChannelSubscriptionsService],
})
export class ChannelSubscriptionsModule {}
