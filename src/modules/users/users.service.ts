import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { checAlreadykExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { ImageGenerator, urlGenerator } from 'src/common/types/generator.types';
import uuid from "uuid"
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly imageGenerator: ImageGenerator,
    private readonly config: ConfigService
  ) { }

  async create(registerData: CreateUserDto, avatar?: string) {
    try {
      if (registerData.email) {
        await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "email", registerData.email)
      }
      if (registerData.username) {
        await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "username", registerData.username)
      }
      const socketId = registerData.clientId
      console.log("Ifdan o'tdi unque test")
      const newUser = await this.prisma.user.create({
        data: {
          username: registerData.username,
          email: registerData.email || "Email"
        }
      })

      if (!avatar) {
        avatar = this.imageGenerator.generateAvatar(registerData.firstName[0] + registerData.lastName[0], this.config)
      } else {
        avatar = urlGenerator(this.config, avatar)
      }
      const newAvatar = await this.prisma.avatar.create({
        data: {
          file: avatar,
          ownerId: newUser.id,
          id: uuid.v4()
        }
      })
      const newProfile = await this.prisma.profile.create({
        data: {
          avatarId: newAvatar.id,
          userId: newUser.id,
        },
        include: {
          avatar: true,
          user: true
        }
      })


      return {
        message: 'This action adds a new chatGetaway',
        user: {
          ...newUser,
          profile: newProfile
        }
      };
    } catch (error) {
      console.log(error)
      return error
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        isBot: true,
        Profile: {
          include: {
            avatar: {
              select: { file: true },
            },
          },
        },
      },
    });

    const result = users.map((user) => {
      const profile = user.Profile.length > 0 ? user.Profile[0] : null;

      return {
        userId: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        isBot: user.isBot,
        firstName: profile?.firstName ?? null,
        lastName: profile?.lastName ?? null,
        avatar: profile?.avatar?.file ?? null,
        profileId: profile?.id ?? null,
      };
    });


    return {
      users: result,
      count: result.length,
      message: "All users fetched successfully",
    };
  }


  findByEMail(email: string) {
    return this.prisma.user.findFirst({ where: { email: email } })
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id }, include: {
        Profile: {
          include: {
            avatar: {
              select: {
                file: true
              }
            }
          }
        }
      }
    })
    if (!user) {
      throw new NotFoundException("User not found")
    }
    const { Profile, email, username, createdAt, isBot, id: userId } = user
    const [{ avatar, firstName, lastName, id: profileId, bio, privateUrl, publicUrl }] = Profile
    const result = {
      userId, email, firstName, lastName, avatar: avatar?.file, bio, privateUrl, publicUrl, isBot, profileId
    }
    return {
      user: result,
      message: `This action returns a #${id} user`
    };
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
