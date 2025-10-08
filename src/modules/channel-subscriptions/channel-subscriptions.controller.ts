import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChannelSubscriptionsService } from './channel-subscriptions.service';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('channel-subscriptions')
export class ChannelSubscriptionsController {
  constructor(private readonly channelSubscriptionsService: ChannelSubscriptionsService) {}

  // ✅ Create a new subscription
  @Post('create/:chatId')
  async create(
    @UserData() user: JwtPayload,
    @Param("chatId") chatId : string
  ) {
    return await this.channelSubscriptionsService.create({chatId}, user.id);
  }

  // ✅ Get all subscriptions for the current user
  @Get('my-subscriptions')
  async findAll(@UserData() user: JwtPayload) {
    return await this.channelSubscriptionsService.findAll(user.id);
  }

  @Get("get-all/by-chatid/:id")
  findAllSubsriptionsByChatId(
    @Param("id") id: string
  ) {
    return this.channelSubscriptionsService.findAllSubsriptionsByChatId(id)
  }

  // ✅ Remove a subscription (unsubscribe)
  @Delete('remove-one/by-subscriptionid/:id')
  async remove(@Param('id') id: string) {
    return await this.channelSubscriptionsService.remove(id);
  }

  @Delete('remove-one/by-subscriberid/:chatid')
  async removeBySubscriberId(@Param('chatid') chatid: string,@UserData() user :JwtPayload) {
    return await this.channelSubscriptionsService.removeBySubscriberId(chatid,user.id);
  }
}
