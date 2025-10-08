import { Injectable, NotFoundException } from '@nestjs/common';
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

async function deleteMessageFiles(message: any) {
  const { files, docs, images, stickers, videos } = message;
  [files, docs, images, stickers, videos].forEach((arr: JsonValue) => {
    if (Array.isArray(arr)) {
      arr.forEach((val) => {
        if (typeof val === 'string') unlinkFile(val);
      });
    }
  });
}

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}

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
    return messageReturnData(message);
  }

  // === FIND ===
  async findUserMessages(chatId: string) {
    await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.USER_CHAT, 'id', chatId);
    const messages = await this.prisma.messageUserChat.findMany({
      where: { chatId },
      select: messageFindEntity,
    });
    return { messages: messages.map(messageReturnData) };
  }

  async findGroupMessages(chatId: string) {
    await checkExistsResurs<UserChat>(this.prisma, ModelsEnumInPrisma.GROUPT_CHAT, 'id', chatId);
    const messages = await this.prisma.messageGroup.findMany({
      where: { chatId },
      select: messageFindEntity,
    });
    return { messages: messages.map(messageReturnData) };
  }

  async findChannelMessages(chatId: string) {
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
    });
    if (!message) throw new NotFoundException('Message not found!');
    return { message: messageReturnData(message) };
  }

  async findChannelChatMessageByMessageId(id: string) {
    const message = await this.prisma.messageChannel.findFirst({
      where: { id },
      select: messageFindEntity,
    });
    if (!message) throw new NotFoundException('Message not found!');
    return { message: messageReturnData(message) };
  }

  // === DELETE ===
  async deleteUserChatMessageById(messageId: string) {
    const message = await checkExistsResurs<MessageUserChat>(
      this.prisma,
      ModelsEnumInPrisma.MESSAGE_USER_CHAT,
      'id',
      messageId
    );
    await this.prisma.messageUserChat.delete({ where: { id: messageId } });
    await deleteMessageFiles(message);
    return { success: true, message: 'User message deleted', deletedId: messageId };
  }

  async deleteGroupChatMessageById(messageId: string) {
    const message = await checkExistsResurs(this.prisma, ModelsEnumInPrisma.MESSAGE_GROUP, 'id', messageId);
    await this.prisma.messageGroup.delete({ where: { id: messageId } });
    await deleteMessageFiles(message);
    return { success: true, message: 'Group message deleted', deletedId: messageId };
  }

  async deleteChannelChatMessageById(messageId: string) {
    const message = await checkExistsResurs(this.prisma, ModelsEnumInPrisma.MESSAGE_CHANNEL, 'id', messageId);
    await this.prisma.messageChannel.delete({ where: { id: messageId } });
    await deleteMessageFiles(message);
    return { success: true, message: 'Channel message deleted', deletedId: messageId };
  }
}
