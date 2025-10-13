import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateChannelMessageDto,
  CreateGroupMessageDto,
  CreateUserMessageDto
} from './dto/create-message.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { messageFindEntity, messageReturnData } from './entities/message.entity';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { MessageUserChat, User, UserChat } from '@prisma/client';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import { JsonValue } from '@prisma/client/runtime/library';
import { SessionsService } from 'src/soket/soket.service';

async function deleteMessageFiles(message: any) {
  const { files, docs, images, stickers, videos } = message;
  [files, docs, images, stickers, videos].forEach((arr: JsonValue) => {
    console.log(arr)
    if (Array.isArray(arr)) {
      arr.forEach((val) => {
        console.log(val)
        if (typeof val === 'string') unlinkFile(val.split("/").at(-1) || "");
      });
    }
  });
}

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionsService,
  ) { }

  // === USER CHAT ===
  async createUserMessage(
    dto: CreateUserMessageDto,
    senderId: string,
    files?: Record<string, string[]> | null
  ) {
    const { chatId } = dto;
    await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, 'id', senderId);
    await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.USER_CHAT, 'id', chatId);

    const message = await this.prisma.messageUserChat.create({
      data: { ...dto, senderId, ...(files || {}) },
      select: messageFindEntity,
    });
    this.sessionService.sendToUser(dto.senderId || senderId, messageReturnData(message), "create-msg",)
    return messageReturnData(message);
  }

  // === GROUP CHAT ===
  async createGroupMessage(
    dto: CreateGroupMessageDto,
    files?: Record<string, string[]> | null
  ) {
    const { chatId, senderId } = dto;
    await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, 'id', senderId);
    await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.GROUPT_CHAT, 'id', chatId);

    const message = await this.prisma.messageGroup.create({
      data: { ...dto, ...(files || {}) },
      select: messageFindEntity,
    });
    this.sessionService.sendToUser(senderId, messageReturnData(message), "create-msg",)

    return messageReturnData(message);
  }

  // === CHANNEL CHAT ===
  async createChannelMessage(
    dto: CreateChannelMessageDto,
    files?: Record<string, string[]> | null
  ) {
    const { chatId, senderId } = dto;
    await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, 'id', senderId);
    await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.CHANNEL_CHAT, 'id', chatId);

    const message = await this.prisma.messageChannel.create({
      data: { ...dto, ...(files || {}) },
      select: messageFindEntity,
    });
    this.sessionService.sendToUser(senderId, messageReturnData(message), "create-msg",)

    return messageReturnData(message);
  }

  // === FIND ===
  async findUserMessages(chatId: string, userId: string) {
    this.sessionService.sendToUser(userId, { userId: userId, isOnline:true })
    
    // 1. Chat mavjudligini tekshiramiz
    const Existschat = await checkExistsResurs<UserChat>(
      this.prisma,
      ModelsEnumInPrisma.USER_CHAT,
      'id',
      chatId
    );
    this.sessionService.sendToUser(userId, { userId: Existschat.user1Id === userId ? Existschat.user2Id : Existschat.user1Id, isOnline:true })

    // 2. Shu foydalanuvchi ushbu chatning ishtirokchisi ekanligini tekshiramiz
    const chat = await this.prisma.userChat.findFirst({
      where: {
        id: chatId,
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
    });

    if (!chat) {
      throw new ForbiddenException('Siz bu chatga kirish huquqiga ega emassiz');
    }

    // 3. Chatga tegishli barcha xabarlarni olish
    const messages = await this.prisma.messageUserChat.findMany({
      where: {
        chatId,
      },
      select: messageFindEntity,
      orderBy: { createdAt: 'asc' }, // ixtiyoriy
    });

    return { messages: messages.map((msg => {
      if(msg.senderId !== userId) {
        this.sessionService.sendToUser(userId,{userId,isOnline : this.sessionService.chekIsOnlie(msg.senderId)},"online")
      }
      return messageReturnData(msg)
    })) };
  }

  async findGroupMessages(chatId: string,userId :string) {

    const chat = await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.GROUPT_CHAT, 'id', chatId);
    const messages = await this.prisma.messageGroup.findMany({
      where: { chatId },
      select: messageFindEntity,
    });

    return { messages: messages.map(messageReturnData) };
  }

  async findChannelMessages(chatId: string,userId : string) {
    this.sessionService.sendToUser(userId, { userId: userId, isOnline:true })
    await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.CHANNEL_CHAT, 'id', chatId);
    const messages = await this.prisma.messageChannel.findMany({
      where: { chatId },
      select: messageFindEntity,
    });
    return { messages: messages.map(messageReturnData) };
  }

  // === FIND ONE ===
  async findUserChatMessageByMessageId(id: string) {
    const message = await this.prisma.messageUserChat.findFirst({
      where: { id },
      select: messageFindEntity,
    });
    if (!message) throw new NotFoundException('Message not found!');

    const chat = await this.prisma.userChat.findFirst({ where: { id: message.chatId } });
    if (!chat) throw new NotFoundException('Chat not found');

    return { chat, message: messageReturnData(message) };
  }

  async findGroupChatMessageByMessageId(id: string) {
    const message = await this.prisma.messageGroup.findFirst({
      where: { id },
      select: messageFindEntity,
      orderBy: {
        createdAt: "desc"
      }
    });
    if (!message) throw new NotFoundException('Message not found!');
    return { message: messageReturnData(message) };
  }

  async findChannelChatMessageByMessageId(id: string) {
    const message = await this.prisma.messageChannel.findFirst({
      where: { id },
      select: messageFindEntity,
      orderBy: {
        createdAt: "asc"
      }
    });
    if (!message) throw new NotFoundException('Message not found!');
    return { message: messageReturnData(message) };
  }

  // === DELETE ===
  async deleteUserChatMessageById(messageId: string) {
    await checkExistsResurs<MessageUserChat>(
      this.prisma,
      ModelsEnumInPrisma.MESSAGE_USER_CHAT,
      'id',
      messageId
    );
    let message = await this.prisma.messageUserChat.findFirst({ where: { id: messageId }, select: messageFindEntity })
    if (!message) return
    await this.prisma.messageUserChat.delete({ where: { id: messageId } });
    await deleteMessageFiles(message);
    this.sessionService.sendToUser(message.senderId, messageReturnData(message), "del-msg",)
    return { success: true, message: 'User message deleted', deletedId: messageId };
  }

  async deleteGroupChatMessageById(messageId: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.MESSAGE_GROUP, 'id', messageId);

    const message =
      await this.prisma.messageGroup.delete({ where: { id: messageId }, select: messageFindEntity });
    await deleteMessageFiles(message);
    this.sessionService.sendToUser(message.senderId, messageReturnData(message), "del-msg")
    return { success: true, message: 'Group message deleted', deletedId: messageId };
  }

  async deleteChannelChatMessageById(messageId: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.MESSAGE_CHANNEL, 'id', messageId);
    const message =
      await this.prisma.messageChannel.delete({ where: { id: messageId }, select: messageFindEntity });
    await deleteMessageFiles(message);
    this.sessionService.sendToUser(message.senderId, messageReturnData(message), "del-msg")
    return { success: true, message: 'Channel message deleted', deletedId: messageId };
  }
}
