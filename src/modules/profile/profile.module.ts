import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ImageGenerator } from 'src/common/types/generator.types';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService,ImageGenerator],
})
export class ProfileModule {}
