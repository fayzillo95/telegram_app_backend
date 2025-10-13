import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ImageGenerator, urlGenerator } from 'src/common/types/generator.types';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { GroupChat, User } from '@prisma/client';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { unlinkFile } from 'src/common/types/file.cotroller.typpes';
import { groupReturnData } from './entities/groupe.entity';

// 🧩 Yagona javob formati

@Injectable()
export class GroupesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly imageGenerator: ImageGenerator
  ) { }

  // ✅ CREATE
  async create(data: CreateGroupeDto, ownerId: string, image?: Express.Multer.File) {
    const existsUser = await checkExistsResurs<User>(
      this.prisma,
      ModelsEnumInPrisma.USERS,
      "id",
      ownerId
    );

    // Title duplication check
    const old = await this.prisma.groupChat.findFirst({
      where: {
        AND: [
          { ownerId: ownerId },
          { title: data.title }
        ]
      }
    });

    if (old) {
      throw new ConflictException(
        `Group "${data.title}" already exists for user "${existsUser.username}"`
      );
    }

    // Default avatar yoki upload
    let img = image
      ? urlGenerator(this.config,image.filename)
      : this.imageGenerator.generateAvatar(data.title.slice(0, 2), this.config);

    const newGroup = await this.prisma.groupChat.create({
      data: {
        title: data.title,
        description: data.description || "",
        ownerId: existsUser.id,
        logo: img,
      },
    });
    const obuna = await this.prisma.groupSubscription.create({
      data: {
        chatId: newGroup.id,
        subscriberId: ownerId,
      }
    })
    console.log(obuna)
    const { _count, ...result } = await this.prisma.groupChat.update({
      where: { id: newGroup.id },
      data: {
        publicUrl: `group-subscriptions/create/${newGroup.id}`,
        privateUrl: `groupes/get-one/${newGroup.id}`
      },
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    })
    result.subscriptionsCount = (_count.subscriptions || 0)
    console.log(_count,result)
    return {
      success: true,
      message: "Group created successfully",
      data: groupReturnData(result)
    };
  }

  // ✅ FIND ALL
  async findAllByOwnerId(ownerId: string) {
    await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", ownerId);
    const groups = await this.prisma.groupChat.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      count: groups.length,
      data: groups.map(groupReturnData)
    };
  }
  async findAll() {
    const groups = await this.prisma.groupChat.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      count: groups.length,
      data: groups.map(groupReturnData)
    };
  }
  // ✅ FIND ONE
  async findOne(id: string) {
    const group = await this.prisma.groupChat.findUnique({
      where: { id }
    });
    if (!group) throw new NotFoundException(`Group not found`);
    return {
      success: true,
      data: groupReturnData(group)
    };
  }

  // ✅ UPDATE
  async update(id: string, dto: UpdateGroupeDto, image?: Express.Multer.File) {
    const group = await checkExistsResurs<GroupChat>(
      this.prisma,
      ModelsEnumInPrisma.GROUPT_CHAT,
      "id",
      id
    );

    let newLogo = group.logo;
    if (image) {
      unlinkFile(group.logo); // eski logoni o‘chir
      newLogo = image.filename;
    }

    const updated = await this.prisma.groupChat.update({
      where: { id },
      data: {
        title: dto.title ?? group.title,
        description: dto.description ?? group.description,
        logo: newLogo
      }
    });

    return {
      success: true,
      message: "Group updated successfully",
      data: groupReturnData(updated)
    };
  }

  // ✅ DELETE
  async remove(id: string) {
    const group = await checkExistsResurs<GroupChat>(
      this.prisma,
      ModelsEnumInPrisma.GROUPT_CHAT,
      "id",
      id
    );


    if (typeof group.logo == "string" && typeof group.logo.split("/").at(-1) === "string") {
      await unlinkFile(group.logo.split("/").at(-1) || "");
    }
    await this.prisma.groupSubscription.deleteMany({
      where : {chatId : group.id}
    })
    await this.prisma.groupChat.delete({ where: { id } });

    return {
      success: true,
      message: "Group deleted successfully",
      deletedId: id
    };
  }
}
