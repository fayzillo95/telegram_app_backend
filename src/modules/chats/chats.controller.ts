import { Controller, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // === GET ALL CHATS (BY TYPE) ===
  @Get('get-all/:type')
  async findAllByType(@Param('type') type: 'user' | 'group' | 'channel') {
    return this.chatsService.findAllByType(type);
  }

  @Get("get-all")
  findAll(){
    return this.chatsService.findAllChats()
  }
  
  // === GET ONE CHAT BY TYPE ===
  @Get('get-one/:type/:id')
  async findOne(
    @Param('type') type: 'user' | 'group' | 'channel',
    @Param('id') id: string,
  ) {
    return this.chatsService.findOneByType(type, id);
  }
}
