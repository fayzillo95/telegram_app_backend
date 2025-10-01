import { Module } from '@nestjs/common';
import { UserchatsService } from './userchats.service';
import { UserchatsController } from './userchats.controller';

@Module({
  controllers: [UserchatsController],
  providers: [UserchatsService],
})
export class UserchatsModule {}
