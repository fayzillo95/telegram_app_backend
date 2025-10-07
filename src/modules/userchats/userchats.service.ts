import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserchatDto } from './dto/create-userchat.dto';
import { UpdateUserchatDto } from './dto/update-userchat.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { messageFindEntity } from '../messages/entities/message.entity';

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
        messages : {
          select : messageFindEntity
        }
      },
    });

    if (oldChat) {
      const { messages, id, createdAt, type, updatedAt, } = oldChat
      const result = messages.map(({ _count, sender, docs, files, createdAt, id, images, senderId, stickers, text, updatedAt, videos }) => {
        const { Profile, createdAt: userRegisteredAt, email, isBot, isDeleted, updatedAt: userUpdatedAt, username, lastActivaty } = sender
        const { avatar, firstName, lastName, privateUrl, publicUrl, id: profileId } = Profile[0]
        return {
          message: { text, files, images, videos, docs, stickers, updatedAt, senderId },
          sender: { firstName, lastName, username, id: senderId, publicUrl, privateUrl, avatar, profileId, email, isBot, lastActivaty }
        }
      })
      return {
        message: 'Chat allaqachon mavjud',
        chat: { chatId : id,type,createdAt,updatedAt, name, image },
        messages: result,
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

  //  FIND ALL

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
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            sender: {
              include: {
                Profile: true
              }
            }
          }
        },
      },
      orderBy: {
        updatedAt: "asc"
      },
      take: 1
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
      const lastMessage = lastMessageData ? {
        id: lastMessageData.id,
        text: lastMessageData.text ?? null,
        senderId: lastMessageData.senderId ?? null,
        senderName: lastMessageData.sender?.Profile?.[0]
          ? `${lastMessageData.sender.Profile[0].firstName ?? ""} ${lastMessageData.sender.Profile[0].lastName ?? ""}`.trim()
          : "Unknown",
        createdAt: lastMessageData.createdAt ?? null,
        isReading: lastMessageData.isReading,
        isUpdated: lastMessageData.isUpdated
      } : null;

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