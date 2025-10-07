import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get("get-all")
  findAll() {
    return this.usersService.findAll();
  }

  @Get('my')
  findOne(@UserData() user: JwtPayload) {
    return this.usersService.findOne(user.id);
  }
  
  @Get("private/:userId")
  privateUrl(
    @Param("userId") userId: string,
    @UserData() user: JwtPayload
  ) {

  }
}
