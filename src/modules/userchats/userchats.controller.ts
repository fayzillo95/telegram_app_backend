import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserchatsService } from './userchats.service';
import { CreateUserchatDto } from './dto/create-userchat.dto';
import { UpdateUserchatDto } from './dto/update-userchat.dto';
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

  @Get()
  findAll() {
    return this.userchatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userchatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserchatDto: UpdateUserchatDto) {
    return this.userchatsService.update(+id, updateUserchatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userchatsService.remove(+id);
  }
}
