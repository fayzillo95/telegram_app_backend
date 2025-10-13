import { Controller, Get, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  // === GET ALL CHATS (BY TYPE) ===
  @Get('get-all/:type')
  async findAllByType(@Param('type') type: 'user' | 'group' | 'channel',@UserData() user : JwtPayload) {
    return this.chatsService.findAllByType(type,user.id);
  }

  @Get("get-all")
  findAll(@UserData() user : JwtPayload){
    return this.chatsService.findAllChats(user.id)
  }
  
  // === GET ONE CHAT BY TYPE ===
  @Get('get-one/:type/:id')
  async findOne(
    @Param('type') type: 'user' | 'group' | 'channel',
    @Param('id') id: string,
    @UserData() user :JwtPayload
  ) {
    return this.chatsService.findOneByType(type, id,user.id);
  }
}
