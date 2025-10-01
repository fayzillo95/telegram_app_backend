import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ImageGenerator } from 'src/common/types/generator.types';

@Module({
  controllers: [UsersController],
  providers: [UsersService,ImageGenerator],
})
export class UsersModule {}
