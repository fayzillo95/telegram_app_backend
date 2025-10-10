import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ImageGenerator } from 'src/common/types/generator.types';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { channelChatReturnData } from '../chats/entities/chat.entity';
import { User } from '@prisma/client';

/**
 * 🎯 ChannelChat modelini frontendga qaytarish uchun yagona format.
 */


@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly imageGenerator: ImageGenerator,
  ) {}

  // ---------------------------------------------------------------------------
  // ✅ CREATE CHANNEL
  // ---------------------------------------------------------------------------
  async create(data: CreateChannelDto, ownerId: string, logo?: Express.Multer.File) {
    // 1️⃣ User mavjudligini tekshirish
    const existsUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      ownerId,
    );

    // 2️⃣ Channel nomi unique ekanligini tekshirish
    const oldChannel = await this.prisma.channelChat.findFirst({
      where: { title: data.title, ownerId },
    });
    if (oldChannel)
      throw new ConflictException(`${data.title} already exists by user ${existsUser.username}`);

    // 3️⃣ Logoni yaratish
    const image = logo
      ? logo.filename
      : this.imageGenerator.generateAvatar(data.title.slice(0, 2), this.config);

    // 4️⃣ Channel yaratish
    const newChannel = await this.prisma.channelChat.create({
      data: {
        ownerId,
        title: data.title,
        logo: image,
        description: data.description ?? null,
        subscriptionsCount: 1,
      },
    });

    // 5️⃣ Ownerni avtomatik subscribe qilish
    await this.prisma.channelSubscription.create({
      data: {
        chatId: newChannel.id,
        subscriberId: ownerId,
      },
    });

    // 6️⃣ Subscriptions countni yangilash
    const updated = await this.prisma.channelChat.update({
      where: { id: newChannel.id },
      data: {
        subscriptionsCount: {
          set: await this.prisma.channelSubscription.count({
            where: { chatId: newChannel.id },
          }),
        },
        publicUrl: `channel-subscriptions/create/${newChannel.id}`,
        privateUrl: `channels/get-one/${newChannel.id}`,
      },
      include: { owner: { include: { Profile: true } } },
    });

    // 7️⃣ Natijani qaytarish
    return {
      message: 'Channel created successfully',
      chat: channelChatReturnData(updated),
    };
  }

  // ---------------------------------------------------------------------------
  // ✅ GET ALL CHANNELS
  // ---------------------------------------------------------------------------
  async findAll() {
    const channels = await this.prisma.channelChat.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: { include: { Profile: true } } },
    });

    return channels.map((ch) => channelChatReturnData(ch));
  }

  // ---------------------------------------------------------------------------
  // ✅ GET ONE CHANNEL
  // ---------------------------------------------------------------------------
  async findOne(id: string) {
    const channel = await this.prisma.channelChat.findUnique({
      where: { id },
      include: {
        owner: { include: { Profile: true } },
        _count: { select: { subscriptions: true } },
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    // `_count.subscriptions` ni `subscriptionsCount` sifatida qo‘shamiz
    return channelChatReturnData({
      ...channel,
      subscriptionsCount: channel._count.subscriptions,
    });
  }

  // ---------------------------------------------------------------------------
  // ✅ UPDATE CHANNEL
  // ---------------------------------------------------------------------------
  async update(id: string, data: UpdateChannelDto, ownerId: string, logo?: Express.Multer.File) {
    const channel = await this.prisma.channelChat.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!channel) throw new NotFoundException('Channel not found');
    if (channel.ownerId !== ownerId)
      throw new ConflictException('Only the owner can update this channel');

    const updated = await this.prisma.channelChat.update({
      where: { id },
      data: {
        title: data.title ?? channel.title,
        description: data.description ?? channel.description,
        publicUrl: data.publicUrl ?? channel.publicUrl,
        privateUrl: data.privateUrl ?? channel.privateUrl,
        logo: logo ? logo.filename : channel.logo,
      },
      include: { owner: { include: { Profile: true } } },
    });

    return {
      message: 'Channel updated successfully',
      chat: channelChatReturnData(updated),
    };
  }

  // ---------------------------------------------------------------------------
  // ✅ REMOVE CHANNEL
  // ---------------------------------------------------------------------------
  async remove(id: string, ownerId: string) {
    const channel = await this.prisma.channelChat.findUnique({ where: { id } });
    if (!channel) throw new NotFoundException('Channel not found');
    if (channel.ownerId !== ownerId)
      throw new ConflictException('Only the owner can delete this channel');

    await this.prisma.channelChat.delete({ where: { id } });

    return {
      message: 'Channel deleted successfully',
      chat: channelChatReturnData(channel),
    };
  }
}
