import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

/** 🔹 Yagona response shakli */
function responseFormatter(success: boolean, message: string, data?: any) {
  return { success, message, data };
}

@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  /** 🟢 Create Channel */
  @Post()
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiResponse({ status: 201, description: 'Channel created successfully' })
  async create(
    @Body() data: CreateChannelDto,
    @UserData() user: JwtPayload,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const result = await this.channelsService.create(data, user.id, logo);
    return responseFormatter(true, 'Channel created successfully', result);
  }

  /** 🟣 Get all Channels */
  @Get("get-all")
  @ApiOperation({ summary: 'Get all channels' })
  @ApiResponse({ status: 200, description: 'List of all channels' })
  async findAll() {
    const result = await this.channelsService.findAll();
    return responseFormatter(true, 'All channels fetched successfully', result);
  }

  /** 🔵 Get One Channel by ID */
  @Get('get-one/:id')
  @ApiOperation({ summary: 'Get channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel fetched successfully' })
  async findOne(@Param('id') id: string) {
    const result = await this.channelsService.findOne(id);
    return responseFormatter(true, 'Channel fetched successfully', result);
  }

  /** 🟠 Update Channel */
  @Patch(':id')
  @ApiOperation({ summary: 'Update existing channel' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateChannelDto,
    @UserData() user : JwtPayload,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const result = await this.channelsService.update(id, data,user.id, logo);
    return responseFormatter(true, 'Channel updated successfully', result);
  }

  /** 🔴 Remove Channel */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete channel by ID' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  async remove(@Param('id') id: string,@UserData() user :JwtPayload) {
    const result = await this.channelsService.remove(id,user.id);
    return responseFormatter(true, 'Channel deleted successfully', result);
  }

}
