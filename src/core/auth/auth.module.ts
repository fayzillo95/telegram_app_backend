import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/modules/users/users.service';
import { ImageGenerator } from 'src/common/types/generator.types';
import { CacheService } from './cache.service';
import { EmailService } from '../email/email.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,UsersService,ImageGenerator,CacheService,EmailService],
})
export class AuthModule {}
