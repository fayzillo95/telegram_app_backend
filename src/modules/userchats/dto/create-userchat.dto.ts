import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ChatType } from '@prisma/client';

export class CreateUserchatDto {

  @ApiProperty({
    description: "Ikkinchi foydalanuvchi ID (chat oluvchi user)",
    example: "7d1c8b8e-54a7-46f9-a1b2-3d4c8b8f9cde",
  })
  @IsUUID()
  user2Id: string;

}
