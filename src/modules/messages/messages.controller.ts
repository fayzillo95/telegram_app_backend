import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UseInterceptors
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { 
  CreateChannelMessageDto, 
  CreateGroupMessageDto, 
  CreateUserMessageDto 
} from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { MessagesInterceptor } from './entities/message.entity';

@Controller('messages')
@UseInterceptors(MessagesInterceptor)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // === USER CHAT ===
  @Post('user')
  createUser(
    @Body() dto: CreateUserMessageDto,
    @UserData() user: JwtPayload,
  ) {
    console.log(dto)
    return this.messagesService.createUserMessage(dto, user.id);
  }

  @Get('user/get-all/:chatId')
  findUserMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findUserMessages(chatId);
  }

  @Get("user/get-all")
  find(
    @UserData() user : JwtPayload
  ){

  }

  // === GROUP CHAT ===
  @Post('group')
  createGroup(@Body() dto: CreateGroupMessageDto) {
    return this.messagesService.createGroupMessage(dto);
  }

  @Get('group/:chatId')
  findGroupMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findGroupMessages(chatId);
  }

  // === CHANNEL CHAT ===
  @Post('channel')
  createChannel(@Body() dto: CreateChannelMessageDto) {
    return this.messagesService.createChannelMessage(dto);
  }

  @Get('channel/:chatId')
  findChannelMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findChannelMessages(chatId);
  }

}
