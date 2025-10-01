import { 
  Controller, Get, Post, Body, Patch, Param, Delete 
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

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // === USER CHAT ===
  @Post('user')
  createUser(
    @Body() dto: CreateUserMessageDto,
    @UserData() user: JwtPayload,
  ) {
    return this.messagesService.createUserMessage(dto, user.id);
  }

  @Get('user/:chatId')
  findUserMessages(@Param('chatId') chatId: string) {
    return this.messagesService.findUserMessages(chatId);
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

  // === UNIVERSAL CRUD (optional, agar kerak bo‘lsa) ===
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(id);
  }
}
