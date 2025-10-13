import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { GroupesService } from './groupes.service';
import { CreateGroupeDto } from './dto/create-groupe.dto';
import { UpdateGroupeDto } from './dto/update-groupe.dto';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';

@Controller('groupes')
export class GroupesController {
  constructor(private readonly groupesService: GroupesService) {}

  // ✅ CREATE
  @Post('create')
  @UseInterceptors(FileInterceptor('logo', fileStorages(['image'])))
  create(
    @Body() createGroupeDto: CreateGroupeDto,
    @UserData() user: JwtPayload,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.groupesService.create(createGroupeDto, user.id, image);
  }

  // ✅ GET ALL (foydalanuvchining barcha guruhlari)
  @Get('get-all/by-ownerid')
  findAllByOwnerId(@UserData() user: JwtPayload) {
    return this.groupesService.findAllByOwnerId(user.id);
  }

  @Get("get-all/groupes")
  findAll(){
    return this.groupesService.findAll()
  }

  // ✅ GET ONE
  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.groupesService.findOne(id);
  }

  // ✅ UPDATE
  @Patch('update-one/:id')
  @UseInterceptors(FileInterceptor('image', fileStorages(['image'])))
  update(
    @Param('id') id: string,
    @Body() updateGroupeDto: UpdateGroupeDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.groupesService.update(id, updateGroupeDto, image);
  }

  // ✅ DELETE
  @Delete('remove-one/:id')
  remove(@Param('id') id: string) {
    return this.groupesService.remove(id);
  }
}
