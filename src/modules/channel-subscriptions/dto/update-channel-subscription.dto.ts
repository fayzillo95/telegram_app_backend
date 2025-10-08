import { PartialType } from '@nestjs/swagger';
import { CreateChannelSubscriptionDto } from './create-channel-subscription.dto';

export class UpdateChannelSubscriptionDto extends PartialType(CreateChannelSubscriptionDto) {}
