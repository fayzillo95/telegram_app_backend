import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GroupSubscriptionsService } from './group-subscriptions.service';
import { CreateGroupSubscriptionDto } from './dto/create-group-subscription.dto';
import { UpdateGroupSubscriptionDto } from './dto/update-group-subscription.dto';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('group-subscriptions')
export class GroupSubscriptionsController {
  constructor(private readonly groupSubscriptionsService: GroupSubscriptionsService) { }

  // ✅ Create a new subscription
  @Post('create/:chatId')
  async create(
    @UserData() user: JwtPayload,
    @Param("chatId") chatId : string
  ) {
    return await this.groupSubscriptionsService.create({chatId}, user.id);
  }

  // ✅ Get all subscriptions for the current user
  @Get('my-subscriptions')
  async findAll(@UserData() user: JwtPayload) {
    return await this.groupSubscriptionsService.findAll(user.id);
  }

  @Get("get-all/by-chatid/:id")
  findAllSubsriptionsByChatId(
    @Param("id") id: string
  ) {
    return this.groupSubscriptionsService.findAllSubsriptionsByChatId(id)
  }

  // ✅ Update a subscription (optional, mostly for admin/testing)
  @Patch('update-ont/by-chatid/:id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupSubscriptionDto: UpdateGroupSubscriptionDto
  ) {
    return await this.groupSubscriptionsService.update(id, updateGroupSubscriptionDto);
  }

  // ✅ Remove a subscription (unsubscribe)
  @Delete('remove-one/by-subscriptionid/:id')
  async remove(@Param('id') id: string) {
    return await this.groupSubscriptionsService.remove(id);
  }

  @Delete('remove-one/by-subscriberid/:chatid')
  async removeBySubscriberId(@Param('chatid') chatid: string,@UserData() user :JwtPayload) {
    return await this.groupSubscriptionsService.removeBySubscriberId(chatid,user.id);
  }
}
