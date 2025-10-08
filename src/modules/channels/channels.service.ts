import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ImageGenerator } from 'src/common/types/generator.types';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { ChannelChat, User } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { profileServiceReturnData } from '../profile/entities/profile.entity';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly imageGenerator: ImageGenerator,
  ) { }

  // ✅ CREATE
  async create(data: CreateChannelDto, ownerId: string, logo?: Express.Multer.File) {
    // 1. user mavjudligini tekshirish
    const existsUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      ownerId,
    );

    // 2. title unique ekanligini tekshirish
    const oldChannel = await this.prisma.channelChat.findFirst({
      where: { title: data.title, ownerId },
    });

    if (oldChannel) {
      throw new ConflictException(`${data.title} already exists by user ${existsUser.username}`);
    }

    // 3. logo yaratish
    const image = logo
      ? logo.filename
      : this.imageGenerator.generateAvatar(data.title.slice(0, 2), this.config);

    // 4. yangi channel yaratish
    const newChannel = await this.prisma.channelChat.create({
      data: {
        ownerId,
        title: data.title,
        logo: image,
        description: data.description ?? null,
        subscriptionsCount: 1, // owner avtomatik obuna bo‘ladi
      },
    });

    // 5. ownerni avtomatik subscribe qilish
    const subscription = await this.prisma.channelSubscription.create({
      data: {
        chatId: newChannel.id,
        subscriberId: ownerId,
      },
      include: {
        subscriber: {
          include: { Profile: true },
        },
      },
    });

    // 6. subscription countni yangilash
    const updatedChannel = await this.prisma.channelChat.update({
      where: { id: newChannel.id },
      data: {
        subscriptionsCount: {
          set: await this.prisma.channelSubscription.count({
            where: { chatId: newChannel.id },
          }),
        },
        publicUrl: `channel-subscriptions/create/${newChannel.id}`,
        privateUrl: `channels/get-one/${newChannel.id}`
      },
      select: {
        id: true,
        title: true,
        logo: true,
        type: true,
        description: true,
        publicUrl: true,
        privateUrl: true,
        subscriptionsCount: true,
        ownerId: true,
        createdAt: true,
      },
    });

    // 7. natijani qaytarish
    return {
      message: 'Channel created successfully',
      chat: updatedChannel,
      owner: profileServiceReturnData(
        subscription.subscriber,
        subscription.subscriber.Profile?.[0],
      ),
    };
  }

  // ✅ GET ALL CHANNELS
  async findAll() {
    const channels = await this.prisma.channelChat.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        logo: true,
        description: true,
        publicUrl: true,
        privateUrl: true,
        subscriptionsCount: true,
        createdAt : true,
        updatedAt  :true,
        owner: {
          include: { Profile: true },
        },
      },
    });

    return channels.map((ch) => ({
      id: ch.id,
      title: ch.title,
      logo: ch.logo,
      description: ch.description,
      publicUrl: ch.publicUrl,
      privateUrl: ch.privateUrl,
      subscriptionsCount: Number(ch.subscriptionsCount),
      createdAt : ch.createdAt,
      updatedAt : ch.updatedAt
      // owner: profileServiceReturnData(ch.owner, ch.owner.Profile?.[0]),
    }));
  }

  // ✅ GET ONE CHANNEL
  async findOne(id: string) {
    const channel = await this.prisma.channelChat.findUnique({
      where: { id },
      include: {
        owner: { include: { Profile: true } },
        _count: { select: { subscriptions: true } },
      },
    });

    if (!channel) throw new NotFoundException('Channel not found');

    return {
      id: channel.id,
      title: channel.title,
      logo: channel.logo,
      description: channel.description,
      publicUrl: channel.publicUrl,
      privateUrl: channel.privateUrl,
      subscriptionsCount: channel._count.subscriptions,
      owner: profileServiceReturnData(channel.owner, channel.owner.Profile?.[0]),
    };
  }

  // ✅ UPDATE CHANNEL
  async update(id: string, data: UpdateChannelDto, ownerId: string, logo?: Express.Multer.File) {
    const channel = await this.prisma.channelChat.findUnique({ where: { id } });
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
      include: {
        owner: { include: { Profile: true } },
      },
    });

    return {
      message: 'Channel updated successfully',
      chat: updated,
      owner: profileServiceReturnData(updated.owner, updated.owner.Profile?.[0]),
    };
  }

  // ✅ REMOVE CHANNEL
  async remove(id: string, ownerId: string) {
    const channel = await this.prisma.channelChat.findUnique({ where: { id } });
    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.ownerId !== ownerId)
      throw new ConflictException('Only the owner can delete this channel');

    await this.prisma.channelChat.delete({ where: { id } });

    return { message: 'Channel deleted successfully', id };
  }
}
