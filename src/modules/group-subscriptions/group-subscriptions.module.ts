import { Module } from '@nestjs/common';
import { GroupSubscriptionsService } from './group-subscriptions.service';
import { GroupSubscriptionsController } from './group-subscriptions.controller';

@Module({
  controllers: [GroupSubscriptionsController],
  providers: [GroupSubscriptionsService],
})
export class GroupSubscriptionsModule {}
