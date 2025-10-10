import { 
  Controller, Get, Post, Body, Param, Delete, 
  UseInterceptors, UploadedFiles 
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { 
  CreateChannelMessageDto, 
  CreateGroupMessageDto, 
  CreateUserMessageDto 
} from './dto/create-message.dto';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { groupFilesByField } from 'src/common/types/filter.file.types';
import { ConfigService } from '@nestjs/config';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService,private readonly config : ConfigService) {}

  // === USER CHAT ===
  @UseInterceptors(AnyFilesInterceptor(fileStorages([])))
  @Post('user')
  createUser(
    @Body() dto: CreateUserMessageDto,
    @UserData() user: JwtPayload,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    const fileFields = files ? groupFilesByField(this.config,files) : null;
    return this.messagesService.createUserMessage(dto, user.id, fileFields);
  }

  @Get('user/get-all/:chatId')
  findUserMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findUserMessages(chatId);
  }

  @Get('user/get-one/:id')
  findUserChatMessage(@UserData() user: JwtPayload, @Param('id') id: string) {
    return this.messagesService.findUserChatMessageByMessageId(id);
  }

  @Delete('user/remove-one/:id')
  deleteUserChatMessage(@Param('id') id: string) {
    return this.messagesService.deleteUserChatMessageById(id);
  }

  // === GROUP CHAT ===
  @UseInterceptors(AnyFilesInterceptor(fileStorages([])))
  @Post('group')
  createGroup(
    @Body() dto: CreateGroupMessageDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    const fileFields = files ? groupFilesByField(this.config,files) : null;
    return this.messagesService.createGroupMessage(dto, fileFields);
  }

  @Get('group/get-all/:chatId')
  findGroupMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findGroupMessages(chatId);
  }

  @Get('group/get-one/:id')
  findGroupChatMessageByMessageId(@Param('id') id: string) {
    return this.messagesService.findGroupChatMessageByMessageId(id);
  }

  @Delete('group/remove-one/:id')
  deleteGroupChatMessage(@Param('id') id: string) {
    return this.messagesService.deleteGroupChatMessageById(id);
  }

  // === CHANNEL CHAT ===
  @UseInterceptors(AnyFilesInterceptor(fileStorages([])))
  @Post('channel')
  createChannel(
    @Body() dto: CreateChannelMessageDto,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    const fileFields = files ? groupFilesByField(this.config,files) : null;
    return this.messagesService.createChannelMessage(dto, fileFields);
  }

  @Get('channel/get-all/:chatId')
  findChannelMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findChannelMessages(chatId);
  }

  @Get('channel/get-one/:id')
  findChannelChatMessageByMessageId(@Param('id') id: string) {
    return this.messagesService.findChannelChatMessageByMessageId(id);
  }

  @Delete('channel/remove-one/:id')
  deleteChannelChatMessage(@Param('id') id: string) {
    return this.messagesService.deleteChannelChatMessageById(id);
  }
}
