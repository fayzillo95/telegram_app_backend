import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UsersModule } from './modules/users/users.module';
import { GroupesModule } from './modules/groupes/groupes.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { UserchatsModule } from './modules/userchats/userchats.module';
import { MessagesModule } from './modules/messages/messages.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './global/guards/jwt.auth.guard';
import { ProfileModule } from './modules/profile/profile.module';
import { GroupSubscriptionsModule } from './modules/group-subscriptions/group-subscriptions.module';
import { ChannelSubscriptionsModule } from './modules/channel-subscriptions/channel-subscriptions.module';
import { ChatsModule } from './modules/chats/chats.module';

@Module({
  imports: [CoreModule, UsersModule, GroupesModule, ChannelsModule, UserchatsModule, MessagesModule, ProfileModule, GroupSubscriptionsModule, ChannelSubscriptionsModule, ChatsModule],
  providers : [
    {
      provide : APP_GUARD,
      useClass : JwtAuthGuard
    }
  ]
})
export class AppModule {}
