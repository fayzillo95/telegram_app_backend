import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post("create")
  @UseInterceptors(FileInterceptor("avatar",fileStorages(["image"])))
  create(
    @Body() createProfileDto: CreateProfileDto,
    @UserData() user : JwtPayload,
    @UploadedFile() file? : Express.Multer.File,
  ) {
    console.log(file,user,createProfileDto)
    return this.profileService.create(createProfileDto,user.id,file);
  }

  @Get("get-all")
  findAll() {
    return this.profileService.findAll();
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
