import { Global, Module } from '@nestjs/common';
import { JwtSubService } from './jwt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({})],
  providers: [JwtSubService, JwtService],
  exports: [JwtSubService],
})
export class JwtSubModule {}