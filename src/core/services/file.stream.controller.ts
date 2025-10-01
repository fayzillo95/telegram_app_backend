import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { FileStreamService } from './file.stream.service';
import { Public } from 'src/global/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorages } from 'src/common/types/upload_types';


@Public()
@Controller()
export class FileStreamerController {

  constructor(
    private readonly fileService: FileStreamService
  ) { }

  @Get('video/:file')
  async streamVideo(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }

  @UseInterceptors(FileInterceptor("avatar",fileStorages(["image"])))
  @Post("avatar")
  writeAvatar(
    @UploadedFile() file : Express.Multer.File
  ){
    return this.fileService.writeFileSerrvice(file.filename)
  }

  @Get('archive/:file')
  async streamArchie(
    @Param('fileName') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
  
  @Get('image/:file')
  async streamImage(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
  
  @Get('docs/:file')
  async streamDocs(
    @Param('file') fileName: string,
    @Res() res: Response
  ) {
    return this.fileService.fileStream(res, fileName)
  }
}
