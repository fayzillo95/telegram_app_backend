import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './soket.gateway';
import { SessionsService } from './soket.service';

@Global()
@Module({
  providers: [ChatGateway, SessionsService],
  exports : [SessionsService]
})
export class SoketModule {}
