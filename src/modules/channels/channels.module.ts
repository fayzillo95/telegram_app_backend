import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { ImageGenerator } from 'src/common/types/generator.types';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService,ImageGenerator],
})
export class ChannelsModule {}
