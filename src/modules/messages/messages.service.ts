import { Injectable } from '@nestjs/common';
import { CreateChannelMessageDto, CreateGroupMessageDto, CreateUserMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

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
    console.log(senderId)
    const details = await this.prisma.messageDetails.create({
      data: {
        senderId: senderId,
        text: dto.text,
        images: dto['images'] ?? undefined,
      },
    });

    return this.prisma.messageUserChat.create({
      data: {
        chatId: dto.chatId,
        mDetailsId: details.id,
      },
      include: { details: {
        select : {
          images : true,
          docs : true,
          files : true,
          id : true ,
          text : true,
          stickers  : true,
          videos  : true,
          sender  : {
            select : {
              Avatar : {
                select : {
                  file : true,
                }
              },
              Profile : {
                select : {
                  id : true,
                  avatar : {
                      select  :{
                        file : true,
                        updatedAt : true,
                      },
                  },
                  firstName : true,
                  lastName : true,
                  bio  : true,
                  userId : true,
                  privateUrl : true,
                  publicUrl : true,
                }
              },
              email : true,
              username  : true
            }
          },
          senderId : true
        }
      } ,replies : true,chat:true,_count : true,userChatFiles  : true},
    });
  }

  async createGroupMessage(dto: CreateGroupMessageDto) {
    const details = await this.prisma.messageDetails.create({
      data: {
        senderId: dto.senderId,
        text: dto.text,
        files: dto.files,
      },
    });

    return this.prisma.messageGroup.create({
      data: {
        chatId: dto.chatId,
        mDetailsId: details.id,
      },
      include: { details: true },
    });
  }

  async createChannelMessage(dto: CreateChannelMessageDto) {
    const details = await this.prisma.messageDetails.create({
      data: {
        senderId: dto.senderId,
        text: dto.text,
        docs: dto.docs,
      },
    });

    return this.prisma.messageChannel.create({
      data: {
        chatId: dto.chatId,
        mDetailsId: details.id,
      },
      include: { details: true },
    });
  }
  // messages.service.ts
  async findUserMessages(chatId: string) {
    const messages = await this.prisma.messageUserChat.findMany({
      where: { chatId },
      include: { details: {
        select  :{
          sender  : {
            include : {
              Profile : {
                select : {
                  firstName  :true,
                  lastName : true,
                  avatar : {
                    select : {file : true}
                  }
                },
              }
            },
          },
          text : true,
          senderId : true,
          id : true,
          files : true,
          docs : true,
          createdAt  :true,
          updatedAt : true,
          images : true,
          videos : true,
          stickers : true,
          _count : true
        }
      }},
    });

    return {messages : messages}
  }

  async findGroupMessages(chatId: string) {
    return this.prisma.messageGroup.findMany({
      where: { chatId },
      include: { details: true },
    });
  }

  async findChannelMessages(chatId: string) {
    return this.prisma.messageChannel.findMany({
      where: { chatId },
      include: { details: true },
    });
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: string) {
    return `This action returns a #${id} message`;
  }

  update(id: string, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: string) {
    return `This action removes a #${id} message`;
  }
}
