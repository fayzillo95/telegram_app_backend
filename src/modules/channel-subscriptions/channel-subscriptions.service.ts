import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { GroupChat, User } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { profileServiceReturnData } from '../profile/entities/profile.entity';


@Injectable()
export class ChannelSubscriptionsService {
  constructor(private readonly prisma: PrismaService) { }

  // ✅ CREATE — subscribe to a group
  async create(data: {chatId : string}, subscriberId: string) {
    await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, 'id', subscriberId);
    const chat = await checkExistsResurs<GroupChat>(this.prisma, ModelsEnumInPrisma.CHANNEL_CHAT, 'id', data.chatId);

    const existing = await this.prisma.channelSubscription.findFirst({
      where: { chatId: data.chatId, subscriberId },
    });
    if (existing) throw new ConflictException('User already subscribed to this group');

    const subscription = await this.prisma.channelSubscription.create({
      data: { chatId: data.chatId, subscriberId },
    });
    const sub = await this.prisma.channelSubscription.findFirst({
      where : {
        chatId : data.chatId,
        subscriberId : subscriberId
      },
      select : {
        subscriber: { include: { Profile: true } },
      }
    })


    await this.prisma.groupChat.update({
      where: { id: data.chatId },
      data: { subscriptionsCount: { increment: 1 } },
    });

    return {
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        chat: chat,
        subscriber:sub ?  profileServiceReturnData(sub.subscriber, sub.subscriber.Profile?.[0]) : sub,
      },
    };
  }

  // ✅ GET ALL user’s subscriptions
  async findAll(subscriberId: string) {
    const subscriptions = await this.prisma.channelSubscription.findMany({
      where: { subscriberId },
      include: {
        chat: { select: { id: true, title: true, logo: true, subscriptionsCount: true } },
        subscriber: { include: { Profile: true } },
      },
    });

    const result = subscriptions.map(sb => ({
      subscriptionId: sb.id,
      chat: sb.chat,
      subscriber: profileServiceReturnData(sb.subscriber, sb.subscriber.Profile?.[0]),
    }));
    
    return {
      success: true,
      count: subscriptions.length,
      subscriptions: result.map(res => {
        const {chat,subscriber,subscriptionId} = res
        const {subscriptionsCount,logo,id,title} = chat
        console.log(result)
        return {
          chat : {
            logo,title,id,subscriptionsCount : subscriptionsCount.toString()
          }
        }
      }),
    };
  }

  async findAllSubsriptionsByChatId(id: string) {
    const result = await this.prisma.channelSubscription.findMany({
      where: { chatId: id },
      include : {
        subscriber : {
          include : {
            Profile : true
          }
        }
      }
    })
    return result.map(sbc => {
      const {subscriber,id,subscriberId,chatId} = sbc
      const res = profileServiceReturnData(subscriber,subscriber.Profile[0])
      return {
        subscriber : res,
        chatId,id
      }
    })
  }

  // ✅ REMOVE — unsubscribe from a group
  async remove(id: string) {
    const subscription = await this.prisma.channelSubscription.findUnique({
      where: { id },
    });
    if (!subscription) throw new NotFoundException('Subscription not found');

    await this.prisma.$transaction([
      this.prisma.groupChat.update({
        where: { id: subscription.chatId },
        data: { subscriptionsCount: { decrement: 1 } },
      }),
      this.prisma.channelSubscription.delete({ where: { id } }),
    ]);

    return {
      success: true,
      message: 'Unsubscribed successfully',
      subscriptionId: id,
    };
  }

  async removeBySubscriberId(chatId: string, subscriberId: string) {
    await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, 'id', subscriberId);
    await checkExistsResurs<GroupChat>(this.prisma, ModelsEnumInPrisma.CHANNEL_CHAT, 'id', chatId);

    const deleted = await this.prisma.channelSubscription.deleteMany({
      where: {
        chatId,
        subscriberId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Subscription not found');
    }

    await this.prisma.groupChat.update({
      where: { id: chatId },
      data: { subscriptionsCount: { decrement: 1 } },
    });

    return {
      success: true,
      message: 'Subscription removed successfully',
    };
  }

}
