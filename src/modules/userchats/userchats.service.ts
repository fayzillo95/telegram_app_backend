import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { messageFindEntity, messageReturnData } from '../messages/entities/message.entity';

@Injectable()
export class UserchatsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(user1Id: string, user2Id: string) {

    // user2 ni oldindan olish (ism va rasm uchun)
    const user2 = await this.prisma.user.findUnique({
      where: { id: user2Id },
      include: {
        Profile: true,
      },
    });

    if (!user2) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    // user2 dan name va image tayyorlab olish
    const name =
      user2?.Profile?.[0]
        ? `${user2.Profile[0].firstName ?? ""} ${user2.Profile[0].lastName ?? ""}`.trim()
        : "No Name";

    const image = user2.Profile[0].avatar;

    // eski chatni tekshirish
    const oldChat = await this.prisma.userChat.findFirst({
      where: {
        OR: [
          { AND: [{ user1Id }, { user2Id }] },
          { AND: [{ user1Id: user2Id }, { user2Id: user1Id }] },
        ],
      },
      include: {
        messages: {
          select: messageFindEntity
        }
      },
    });

    if (oldChat) {
      const { messages, id, createdAt, type, updatedAt, } = oldChat
      return {
        message: 'Chat allaqachon mavjud',
        chat: { chatId: id, type, createdAt, updatedAt, name, image },
        messages: messages.map((message) => messageReturnData(message)),
      };
    }

    // yangi chat yaratish
    const chat = await this.prisma.userChat.create({
      data: { user1Id, user2Id },
    });

    return {
      message: 'Chat muvaffaqiyatli yaratildi',
      chat: { ...chat, name, image },
      messages: [],
    };
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