import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray } from "class-validator";

export class CreateMessageDto{}
//
// === User Message DTO ===
//
export class CreateUserMessageDto {
  @ApiProperty({ description: "Chat ID (UserChat jadvalidan)", example: "b8f1d9c2-3456-4a21-a7ef-1234567890ab" })
  @IsString()
  chatId: string;

  @ApiPropertyOptional({ description: "Matn xabari", example: "Salom, yaxshimisiz?" })
  @IsOptional()
  @IsString()
  text?: string;
}

//
// === Group Message DTO ===
//
export class CreateGroupMessageDto {
  @ApiProperty({ description: "Group Chat ID", example: "c7e8f1a2-7890-1234-bcde-9876543210ab" })
  @IsString()
  chatId: string;

  @ApiProperty({ description: "Yuboruvchi User ID", example: "a1b2c3d4-5678-90ab-cdef-1234567890ab" })
  @IsString()
  senderId: string;

  @ApiPropertyOptional({ description: "Matnli habar", example: "Bugun yig‘ilish soat 7 da." })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ description: "Fayllar", example: ["file1.pdf", "file2.docx"] })
  @IsOptional()
  @IsArray()
  files?: any[];
}

//
// === Channel Message DTO ===
//
export class CreateChannelMessageDto {
  @ApiProperty({ description: "Channel Chat ID", example: "e3f2a1b4-5678-4321-bcde-0987654321ab" })
  @IsString()
  chatId: string;

  @ApiProperty({ description: "Yuboruvchi User ID", example: "a1b2c3d4-5678-90ab-cdef-1234567890ab" })
  @IsString()
  senderId: string;

  @ApiPropertyOptional({ description: "Matn", example: "Bugungi yangilik: yangi funksiya ishga tushdi!" })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ description: "Hujjatlar", example: ["report.pdf", "manual.docx"] })
  @IsOptional()
  @IsArray()
  docs?: any[];
}
