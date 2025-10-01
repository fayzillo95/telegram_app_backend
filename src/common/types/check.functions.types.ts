import { ConflictException, HttpException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../core/prisma/prisma.service";
import { ModelsEnumInPrisma } from "./global.types";

export async function checAlreadykExistsResurs(
  prisma: PrismaService,
  modelName: ModelsEnumInPrisma,
  field: string,
  value: any
) {
  if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {
    // @ts-ignore
    const result = await prisma[modelName].findFirst({
      where: {
        [field]: value,
      },
    });
    if (result) {
      throw new ConflictException(`${modelName} in ${field} already exists ${value}`)
    }
    return result
  } else {
    return null
  }
}

export async function checkExistsResurs<T>(
  prisma: PrismaService,
  modelName: ModelsEnumInPrisma,
  field: string,
  value: any
):Promise<T> {
  if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {
    try {
      const result = await prisma[modelName].findFirst({
        where: {
          [field]: value,
        },
      });
      if (!result) {
        throw new NotFoundException(`${modelName[0].toUpperCase()}${modelName.slice(1)} Not found  by ${field} `)
      }
      return result
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new HttpException("Kutilmagan xatolik !", 500)
      }
    }
  } else {
    throw new HttpException("Kutilmagan xatolik !", 500)
  }
}