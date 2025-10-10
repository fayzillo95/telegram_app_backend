import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { channelChatReturnData } from './entities/chat.entity';
import { profileServiceReturnData } from '../profile/entities/profile.entity';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) { }

  // === FIND ALL BY TYPE ===
  async findAllByType(type: 'user' | 'group' | 'channel') {
    switch (type) {
      // 👤 PRIVATE CHATS
      case 'user': {
        const chats = await this.prisma.userChat.findMany({
          include: {
            user1: { include: { Profile: true } },
            user2: { include: { Profile: true } },
          },
          orderBy: { updatedAt: 'desc' },
        });

        return chats.map((chat) => {
          const { id, createdAt, updatedAt, type, user1, user2 } = chat;

          // Qarama-qarshi tomondagi user — biz ko‘rsatmoqchi bo‘lgan "owner"
          const owner = user2; // yoki user1 — login bo‘lgan userga qarab almashtirasiz

          const profile = owner.Profile?.[0];
          const title = `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim();
          const logo = profile?.avatar ?? null;
          const description = profile?.bio ?? null;

          return channelChatReturnData({
            id,
            title,
            logo,
            description,
            publicUrl: profile?.publicUrl ?? null,
            privateUrl: profile?.privateUrl ?? null,
            subscriptionsCount: 1,
            createdAt,
            updatedAt,
            type,
            owner,
          } as any);
        });
      }


      // 👥 GROUP CHATS
      case 'group': {
        const chats = await this.prisma.groupChat.findMany({
          include: {
            owner: { include: { Profile: true } },
            _count: { select: { subscriptions: true } },
          },
        });

        return chats.map((ch) =>
          channelChatReturnData({
            ...ch,
            subscriptionsCount: ch._count.subscriptions,
          }),
        );
      }

      // 📢 CHANNEL CHATS
      case 'channel': {
        const chats = await this.prisma.channelChat.findMany({
          include: {
            owner: { include: { Profile: true } },
            _count: { select: { subscriptions: true } },
          },
        });

        return chats.map((ch) =>
          channelChatReturnData({
            ...ch,
            subscriptionsCount: ch._count.subscriptions,
          }),
        );
      }

      default:
        throw new NotFoundException(`Unknown chat type: ${type}`);
    }
  }
  async findAllChats() {
    // 1️⃣ User chatlar
    const userChats = await this.prisma.userChat.findMany({
      include: {
        user1: { include: { Profile: true } },
        user2: { include: { Profile: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const userChatData = userChats.map((chat) => {
      const { id, createdAt, updatedAt, type, user1, user2 } = chat;
      const profile = user2.Profile?.[0];
      const title = `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim();
      const logo = profile?.avatar ?? null;

      return channelChatReturnData({
        id,
        title,
        logo,
        description: profile?.bio ?? null,
        publicUrl: profile?.publicUrl ?? null,
        privateUrl: profile?.privateUrl ?? null,
        subscriptionsCount: 1,
        createdAt,
        updatedAt,
        type,
        owner: user2,
      } as any);
    });

    // 2️⃣ Group chatlar
    const groupChats = await this.prisma.groupChat.findMany({
      include: {
        owner: { include: { Profile: true } },
        _count: { select: { subscriptions: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const groupChatData = groupChats.map((ch) =>
      channelChatReturnData({
        ...ch,
        subscriptionsCount: ch._count.subscriptions,
        owner: ch.owner,
      } as any),
    );

    // 3️⃣ Channel chatlar
    const channelChats = await this.prisma.channelChat.findMany({
      include: {
        owner: { include: { Profile: true } },
        _count: { select: { subscriptions: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const channelChatData = channelChats.map((ch) =>
      channelChatReturnData({
        ...ch,
        subscriptionsCount: ch._count.subscriptions,
        owner: ch.owner,
      } as any),
    );

    // 4️⃣ Hammasini birlashtirish
    const allChats = [...userChatData, ...groupChatData, ...channelChatData];

    // 5️⃣ Yangilanish sanasiga qarab tartiblash
    return allChats.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  // === FIND ONE BY TYPE ===
  async findOneByType(type: 'user' | 'group' | 'channel', id: string) {
    switch (type) {
      case 'user': {
        const chat = await this.prisma.userChat.findUnique({
          where: { id },
          include: {
            user1: { include: { Profile: true } },
            user2: { include: { Profile: true } },
          },
        });

        if (!chat) throw new NotFoundException('User chat not found');

        // Chatdagi user1 va user2 ni aniqlaymiz
        const { user1, user2, createdAt, updatedAt, id: chatId, type } = chat;

        // Agar profil bo‘lmasa, xatolik
        if (!user1?.Profile?.[0] || !user2?.Profile?.[0])
          throw new NotFoundException('User profiles not found');

        // Chat nomi — ikkinchi foydalanuvchining ismi familiyasi
        const title = `${user2.Profile[0].firstName} ${user2.Profile[0].lastName}`;
        const logo = user2.Profile[0].avatar;

        // Owner (ya’ni siz bilan yozishayotgan odam)
        const owner = user2;

        // profile maydonlarini chiqarib olamiz
        const { bio, publicUrl, privateUrl } = user2.Profile[0];

        // Channel bilan bir xil formatda qaytaramiz
        return channelChatReturnData({
          id: chatId,
          title,
          logo,
          description: bio ?? null,
          publicUrl,
          privateUrl,
          subscriptionsCount: 1,
          createdAt,
          updatedAt,
          type,
          owner,
        } as any);
      }

      case 'group': {
        const chat = await this.prisma.groupChat.findUnique({
          where: { id },
          include: {
            owner: { include: { Profile: true } },
            _count: { select: { subscriptions: true } },
          },
        });
        if (!chat) throw new NotFoundException('Group chat not found');
        return channelChatReturnData({
          ...chat,
          subscriptionsCount: chat._count.subscriptions,
        });
      }

      case 'channel': {
        const chat = await this.prisma.channelChat.findUnique({
          where: { id },
          include: {
            owner: { include: { Profile: true } },
            _count: { select: { subscriptions: true } },
          },
        });
        if (!chat) throw new NotFoundException('Channel chat not found');
        return channelChatReturnData({
          ...chat,
          subscriptionsCount: chat._count.subscriptions,
        });
      }

      default:
        throw new NotFoundException(`Unknown chat type: ${type}`);
    }
  }
}
