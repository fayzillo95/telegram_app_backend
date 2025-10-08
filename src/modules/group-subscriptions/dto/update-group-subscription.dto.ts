import { PartialType } from '@nestjs/swagger';
import { CreateGroupSubscriptionDto } from './create-group-subscription.dto';

export class UpdateGroupSubscriptionDto extends PartialType(CreateGroupSubscriptionDto) {}
