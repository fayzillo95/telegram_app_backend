import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  checAlreadykExistsResurs,
  checkExistsResurs,
} from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { ImageGenerator, urlGenerator } from 'src/common/types/generator.types';
import { ConfigService } from '@nestjs/config';
import { User, Profile } from '@prisma/client';
import { userReturnData } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private imageGen: ImageGenerator,
    private config: ConfigService,
  ) {}

  /** 🧠 CREATE USER */
  async create(dto: CreateUserDto, avatar?: string) {
    try {
      if (dto.email)
        await checAlreadykExistsResurs(
          this.prisma,
          ModelsEnumInPrisma.USERS,
          'email',
          dto.email,
        );
      if (dto.username)
        await checAlreadykExistsResurs(
          this.prisma,
          ModelsEnumInPrisma.USERS,
          'username',
          dto.username,
        );

      const user = await this.prisma.user.create({
        data: { username: dto.username, email: dto.email || 'Email' },
      });

      avatar = avatar
        ? urlGenerator(this.config, avatar)
        : this.imageGen.generateAvatar(
            dto.firstName[0] + dto.lastName[0],
            this.config,
          );

      const profile = await this.prisma.profile.create({
        data: { avatar, userId: user.id },
      });

      return userReturnData(user, profile, 'User successfully created');
    } catch (e) {
      console.error(e);
      return userReturnData(null, null, 'Error creating user', 500);
    }
  }

  /** 🧠 GET ALL USERS */
  async findAll() {
    const users = await this.prisma.user.findMany({
      where  :{
        AND : [
          {isDeleted : false},
          {isBot : false}
        ]
      },
      include: { Profile: true },
    });

    const data = users.map((u) =>
      userReturnData(u, u.Profile[0], 'User fetched').data,
    );

    return {
      status: 200,
      success: true,
      message: 'All users fetched successfully',
      count: data.length,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /** 🧠 FIND BY EMAIL */
  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user;
  }

  /** 🧠 PRIVATE URL */
  async findPrivateUrl(userId: string) {
    const user = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      'id',
      userId,
    );
    const profile = await this.prisma.profile.findFirst({ where: { userId } });
    if (!profile) throw new NotFoundException('User profile not found!');
    return userReturnData(user, profile, 'User private URL fetched successfully');
  }

  /** 🧠 FIND ONE */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { Profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return userReturnData(user, user.Profile?.[0], `User ${id} fetched successfully`);
  }

  /** 🧠 UPDATE */
  async update(id: string, data: UpdateUserDto) {
    if(data.email) await checAlreadykExistsResurs(this.prisma,ModelsEnumInPrisma.USERS,"email",data.email)
    if(data.username) await checAlreadykExistsResurs(this.prisma,ModelsEnumInPrisma.USERS,"username",data.username)  
    const user  = await checkExistsResurs<User>(this.prisma,ModelsEnumInPrisma.USERS,"id",id)
    
    this.prisma[ModelsEnumInPrisma.USERS]

    const profile = await this.prisma.profile.findFirst({where : { userId : id}})
    const updatedUser =  await this.prisma.user.update({
      where : {id: id},
      data : {
        email : data.email || user.email,
        username : data.username || user.username,
      }
    })
    return userReturnData(updatedUser, profile, `This action updates a #${id} user`);
  }

  /** 🧠 REMOVE */
  async remove(id: string) {
    const user  = await checkExistsResurs<User>(this.prisma,ModelsEnumInPrisma.USERS,"id",id)
    await this.prisma.user.update({
      where : {id : id},
      data : {
        isDeleted : true
      }
    })
    return userReturnData(null, null, `This action removes a #${id} user`);
  }
}
