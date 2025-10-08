import { Module } from '@nestjs/common';
import { GroupesService } from './groupes.service';
import { GroupesController } from './groupes.controller';
import { ImageGenerator } from 'src/common/types/generator.types';

@Module({
  controllers: [GroupesController],
  providers: [GroupesService,ImageGenerator],
})
export class GroupesModule {}
