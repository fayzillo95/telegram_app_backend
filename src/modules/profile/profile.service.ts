import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ImageGenerator, urlGenerator } from 'src/common/types/generator.types';
import { Profile } from '@prisma/client';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly imageGenerator: ImageGenerator,
  ) { }

  // ✅ CREATE
  async create(data: CreateProfileDto, userId: string, file?: Express.Multer.File) {
    const oldProfile = await this.prisma.profile.findFirst({ where: { userId } });
    if (oldProfile) {
      throw new ConflictException('Profile already exists');
    }

    // Default avatar generatsiya qilish
    let img = this.imageGenerator.generateAvatar(
      data.firstName && data.lastName
        ? data.firstName[0] + data.lastName[0]
        : data.firstName
          ? data.firstName.slice(0, 2)
          : data.lastName
            ? data.lastName.slice(0, 2)
            : 'US',
      this.config,
    );

    // Agar fayl kelsa - fayl URL’ni yozib qo‘yish
    if (file && file.filename) {
      img = urlGenerator(this.config, file.filename);
    }

    const avatar = await this.prisma.avatar.create({
      data: {
        file: img,
        ownerId: userId,
      },
    });

    // Username update qilish
    if (data.username) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { username: data.username },
      });
    }

    // Profile yaratish
    const dataProfile: Partial<Profile> = {};
    Object.keys(data).forEach((key) => {
      if (key === 'username') return;
      dataProfile[key] = data[key];
    });

    const newProfile = await this.prisma.profile.create({
      data: {
        avatarId: avatar.id,
        ...dataProfile,
        userId: userId,
      },
      include: {
        avatar: true,
        user: true,
      },
    });

    return {
      message: 'This action adds a new profile',
      profile: newProfile,
    };
  }

  // ✅ READ ALL
  async findAll() {
    const profiles = await this.prisma.profile.findMany({
      include: {
        avatar: true,
        user: true,
      },
    });

    return {
      count: profiles.length,
      profiles,
    };
  }

  // ✅ READ ONE
  async findOne(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        avatar: true,
        user: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  // ✅ UPDATE
  async update(id: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    let imgUrl: string | null = null;

    if (file && file.filename) {
      imgUrl = urlGenerator(this.config, file.filename);
      // Avatarni yangilash
      await this.prisma.avatar.update({
        where: { id: profile.avatarId },
        data: { file: imgUrl },
      });
    }

    // Agar username bo‘lsa - user table ni update qilish
    if (updateProfileDto.username) {
      await this.prisma.user.update({
        where: { id: profile.userId },
        data: { username: updateProfileDto.username },
      });
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data: {
        firstName: updateProfileDto.firstName,
        lastName: updateProfileDto.lastName,
        bio: updateProfileDto.bio,
      },
      include: {
        avatar: true,
        user: true,
      },
    });

    return {
      message: 'Profile successfully updated',
      profile: updatedProfile,
    };
  }

  // ✅ DELETE
  async remove(id: string) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Avatarlardagi fayl nomlarini olish
    const avatars = await this.prisma.avatar.findMany({
      where: { ownerId: profile.userId },
      select: { file: true },
    });


    // DB dan barcha avatarlarni o‘chirish
    await this.prisma.avatar.deleteMany({ where: { ownerId: profile.userId } });
    // Diskdan fayllarni o‘chirish
    for (const avatar of avatars) {
      const fileName = avatar.file.split("/").at(-1);
      if (fileName) {
        unlinkFile(fileName);
      }
    }

    // DB dan profilni o‘chirish
    await this.prisma.profile.delete({ where: { id } });

    return { message: 'Profile and all related avatars deleted successfully' };
  }

}
