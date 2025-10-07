import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserchatsService } from './userchats.service';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('userchats')
export class UserchatsController {
  constructor(private readonly userchatsService: UserchatsService) {}

  @Post("create/:user2Id")
  create(
    @Param("user2Id") user2Id : string,
    @UserData() user : JwtPayload
  ) {
    return this.userchatsService.create(user.id,user2Id);
  }

  @Get("my-chats")
  findAllOwnerChats(
    @UserData() user : JwtPayload
  ){
    return this.userchatsService.findAll(user.id)
  }

}
