import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ImageGenerator, urlGenerator } from 'src/common/types/generator.types';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import { profileServiceReturnData } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly imageGenerator: ImageGenerator,
  ) {}

  // ✅ CREATE
  async create(dto: CreateProfileDto, userId: string, file?: Express.Multer.File) {
    const oldProfile = await this.prisma.profile.findFirst({ where: { userId } });
    if (oldProfile) throw new ConflictException('Profile already exists');

    // Avatar tayyorlash
    let img = '';
    if (file?.filename) {
      img = urlGenerator(this.config, file.filename);
    } else {
      img = this.imageGenerator.generateAvatar(
        dto.firstName && dto.lastName
          ? dto.firstName[0] + dto.lastName[0]
          : dto.firstName?.slice(0, 2) || dto.lastName?.slice(0, 2) || 'US',
        this.config,
      );
    }

    // Username update
    if (dto.username) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { username: dto.username },
      });
    }

    // Profile yaratish
    const { username, ...rest } = dto;

    const newProfile = await this.prisma.profile.create({
      data: {
        ...rest,
        avatar: img,
        userId,
        privateUrl: `users/private/${userId}`,
        publicUrl: `userchats/create/${userId}`,
      },
      include: { user: true },
    });

    return {
      message: 'Profile created successfully',
      user: profileServiceReturnData(newProfile.user, newProfile),
    };
  }

  // ✅ FIND ALL
  async findAll() {
    const profiles = await this.prisma.profile.findMany({ include: { user: true } });

    const users = profiles.map((p) => profileServiceReturnData(p.user, p));

    return {
      message: 'All profiles fetched successfully',
      count: users.length,
      users,
    };
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    return {
      message: 'Profile fetched successfully',
      user: profileServiceReturnData(profile.user, profile),
    };
  }

  // ✅ UPDATE
  async update(id: string, dto: UpdateProfileDto, file?: Express.Multer.File) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    let img = profile.avatar;

    if (file?.filename) {
      img = urlGenerator(this.config, file.filename);
      if (profile.avatar) {
        const oldFile = profile.avatar.split('/').at(-1);
        if (oldFile) unlinkFile(oldFile);
      }
    }

    // Username update
    if (dto.username) {
      await this.prisma.user.update({
        where: { id: profile.userId },
        data: { username: dto.username },
      });
    }

    const updated = await this.prisma.profile.update({
      where: { id },
      data: {
        avatar: img,
        firstName: dto.firstName ?? profile.firstName,
        lastName: dto.lastName ?? profile.lastName,
        bio: dto.bio ?? profile.bio,
      },
      include: { user: true },
    });

    return {
      message: 'Profile successfully updated',
      user: profileServiceReturnData(updated.user, updated),
    };
  }

  // ✅ DELETE
  async remove(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    const fileName = profile.avatar?.split('/').at(-1);
    if (fileName) unlinkFile(fileName);

    await this.prisma.profile.delete({ where: { id } });

    return {
      message: 'Profile deleted successfully',
      user: profileServiceReturnData(profile.user, profile),
    };
  }
}
