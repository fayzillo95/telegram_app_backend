import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { messageFindEntity, messageReturnData } from '../messages/entities/message.entity';
import { SessionsService } from 'src/soket/soket.service';
import { channelChatReturnData } from '../chats/entities/chat.entity';

@Injectable()
export class UserchatsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionsService
  ) { }

  async create(user1Id: string, user2Id: string) {
    const user2 = await this.prisma.user.findUnique({
      where: { id: user2Id },
      include: { Profile: true },
    });

    if (!user2) throw new NotFoundException('Foydalanuvchi topilmadi');

    // Eski chatni tekshirish
    const oldChat = await this.prisma.userChat.findFirst({
      where: {
        OR: [
          { AND: [{ user1Id }, { user2Id }] },
          { AND: [{ user1Id: user2Id }, { user2Id: user1Id }] },
        ],
      },
      include: {
        user1: { include: { Profile: true } },
        user2: { include: { Profile: true } },
      },
    });

    // 🔹 Agar eski chat mavjud bo‘lsa
    if (oldChat) {
      // Token egasi kimligini aniqlaymiz
      const isUser1 = oldChat.user1Id === user1Id;

      // Qarama-qarshi foydalanuvchi
      const targetUser = isUser1 ? oldChat.user2 : oldChat.user1;
      const profile = targetUser.Profile?.[0];

      return channelChatReturnData({
        id: oldChat.id,
        title: `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim(),
        logo: profile?.avatar ?? null,
        description: profile?.bio ?? null,
        publicUrl: profile?.publicUrl ?? null,
        privateUrl: profile?.privateUrl ?? null,
        subscriptionsCount: 1,
        createdAt: oldChat.createdAt,
        updatedAt: oldChat.updatedAt,
        type: oldChat.type,
        owner: targetUser, // ✅ har doim qarama-qarshi tomon
        user2Id: oldChat.user1Id === oldChat.user2Id ? oldChat.user1Id : targetUser.id,
      } as any);
    }

    // 🔹 Agar eski chat bo‘lmasa — yangi yaratamiz
    const chat = await this.prisma.userChat.create({
      data: { user1Id, user2Id },
      include: {
        user1: { include: { Profile: true } },
        user2: { include: { Profile: true } },
      },
    });

    this.sessionService.sendToUser(user1Id, chat, "new-chat");

    // Token egasi kimligini aniqlaymiz
    const isUser1 = chat.user1Id === user1Id;
    const targetUser = isUser1 ? chat.user2 : chat.user1;
    const profile = targetUser.Profile?.[0];

    return channelChatReturnData({
      id: chat.id,
      title: `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim(),
      logo: profile?.avatar ?? null,
      description: profile?.bio ?? null,
      publicUrl: profile?.publicUrl ?? null,
      privateUrl: profile?.privateUrl ?? null,
      subscriptionsCount: 1,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      type: chat.type,
      owner: targetUser, // ✅ har doim qarama-qarshi tomon
      user2Id: chat.user1Id === chat.user2Id ? user1Id : targetUser.Profile[0].userId,
    } as any);
  }


  async findAll(user1Id: string) {
    const allChats = await this.prisma.userChat.findMany({
      where: {
        OR: [
          { user1Id: user1Id },
          { user2Id: user1Id }
        ]
      },
      include: {
        user1: {
          include: {
            Profile: true,
          }
        },
        user2: {
          include: {
            Profile: true,
          }
        },
        messages: {
          select: messageFindEntity,
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
      },
      orderBy: {
        updatedAt: "asc"
      },
    },);

    // Har bir chat uchun flatten qilingan ma'lumot
    const chatsWithDetails = allChats.map(chat => {
      const otherUser = chat.user1Id === user1Id ? chat.user2 : chat.user1;

      // Name va Image
      const name = otherUser?.Profile?.[0]
        ? `${otherUser.Profile[0].firstName ?? ""} ${otherUser.Profile[0].lastName ?? ""}`.trim()
        : "No Name";
      const image = otherUser.Profile[0].avatar ?? null;

      // Last Message - flatten qilingan
      const lastMessageData = chat.messages[0];
      const lastMessage = lastMessageData ? messageReturnData(lastMessageData) : null;

      return {
        id: chat.id,
        user1Id: chat.user1Id,
        user2Id: chat.user2Id,
        type: chat.type,
        name,
        image,
        lastMessage,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      };
    });

    return {
      message: 'Barcha chatlar',
      count: chatsWithDetails.length,
      chats: chatsWithDetails
    };
  }

}