import { Injectable } from '@nestjs/common';
import { CreateUserchatDto } from './dto/create-userchat.dto';
import { UpdateUserchatDto } from './dto/update-userchat.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserchatsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }
  async create(user1Id: string, user2Id: string) {
    // user2 ni oldindan olish (ism va rasm uchun)
    const user2 = await this.prisma.user.findUnique({
      where: { id: user2Id },
      include: {
        Profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        Avatar: {
          select: {
            file: true,
          },
        },
      },
    });

    // user2 dan name va image tayyorlab olish
    const name =
      user2?.Profile?.[0]
        ? `${user2.Profile[0].firstName ?? ""} ${user2.Profile[0].lastName ?? ""}`.trim()
        : "No Name";

    const image = user2?.Avatar?.[0]?.file ?? null;

    // eski chatni tekshirish
    const oldChat = await this.prisma.userChat.findFirst({
      where: {
        OR: [
          { AND: [{ user1Id }, { user2Id }] },
          { AND: [{ user1Id: user2Id }, { user2Id: user1Id }] },
        ],
      },
      include: { messages: true },
    });

    if (oldChat) {
      return {
        chat: { ...oldChat, name, image },
        messages: oldChat.messages,
      };
    }

    // yangi chat yaratish
    const chat = await this.prisma.userChat.create({
      data: { user1Id, user2Id },
    });

    return {
      chat: { ...chat, name, image },
      messages: [],
    };
  }


  findAll() {
    return `This action returns all userchats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userchat`;
  }

  update(id: number, updateUserchatDto: UpdateUserchatDto) {
    return `This action updates a #${id} userchat`;
  }

  remove(id: number) {
    return `This action removes a #${id} userchat`;
  }
}
