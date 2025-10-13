import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JwtSubModule } from './jwt/jwt.module';
import { EmailModule } from './email/email.module';
import { FileStreamerController } from './services/file.stream.controller';
import { FileStreamService } from './services/file.stream.service';
// import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        ".env",
      ]
    }),
    PrismaModule,
    JwtSubModule,
    EmailModule,
    AuthModule,
  ],
  controllers : [FileStreamerController],
  providers : [FileStreamService]
})
export class CoreModule { }