import { Injectable } from '@nestjs/common';
import { CreateChannelMessageDto, CreateGroupMessageDto, CreateUserMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { messageFindEntity, messageReturnData } from './entities/message.entity';

@Injectable()
export class MessagesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: object) {
    console.log(data)
    if (data['type']) {
      switch (data['type']) {

      }
    }
    return 'This action adds a new message';
  }

  async createUserMessage(dto: CreateUserMessageDto, senderId: string) {
    console.log(dto)
    const message = await this.prisma.messageUserChat.create({
      data: { ...dto, senderId: senderId },
      select: messageFindEntity
    });
    return messageReturnData(message)
  }

  async createGroupMessage(dto: CreateGroupMessageDto) {

    const message = await this.prisma.messageGroup.create({
      data: {
        ...dto
      },
      select: messageFindEntity,
    });
    return messageReturnData(message)
  }

  async createChannelMessage(dto: CreateChannelMessageDto) {
    const message = await this.prisma.messageChannel.create({
      data: { ...dto },
      select: messageFindEntity,
    });
    return messageReturnData(message)
  }

  async findUserMessages(chatId: string) {
    const messages = await this.prisma.messageUserChat.findMany({
      where: { chatId },
      select: messageFindEntity
    });

    return {
      messages: messages.map(message => {
        return messageReturnData(message)
      })
    }
  }

  async findGroupMessages(chatId: string) {
    const messages = await this.prisma.messageGroup.findMany({
      where: { chatId },
      select: messageFindEntity,
    });
    return {
      messages: messages.map(message => {
        return messageReturnData(message)
      })
    }
  }

  async findChannelMessages(chatId: string) {
    const messages = await this.prisma.messageChannel.findMany({
      where: { chatId },
      select: messageFindEntity
    });
    return {
      messages: messages.map(message => {
        return messageReturnData(message)
      })
    }
  }

  async findAllUserChatInOwnerId(user1Id: string) {
    const myChats = await this.prisma.userChat.findMany({
      where: {
        OR: [
          { user1Id: user1Id },
          { user2Id: user1Id }
        ]
      },
    })

    return {
      message: `This action returns all messages`,
      allChats: myChats
    };
  }

}
