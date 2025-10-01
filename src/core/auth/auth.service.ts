import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { JwtSubService } from '../jwt/jwt.service';
import { EmailService } from '../email/email.service';
import { CacheService } from './cache.service';
import { EmailCodeEnum } from 'src/common/types/enum.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtSubService,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
  ) {}

  async sendOtp(data: CreateAuthDto) {
    const exists = await this.userService.findByEMail(data.email);

    const code = Math.floor(100000 + Math.random() * 900000);
    await this.emailService.sendResedPasswordVerify(
      data.email,
      code,
      EmailCodeEnum.REGISTER,
    );

    this.cacheService.set(
      data.email,
      { email: data.email, code },
      1000 * 60 * 5, 
    );

    if (exists) {
      const sessionToken = await this.jwtService.getSessionToken(exists);
      return {
        sessionToken,
        verificationUrl: '/api/auth/exists/verification',
      };
    } else {
      return {
        verificationUrl: '/api/auth/register/verification',
      };
    }
  }

  async verifyExistsUser(userId: string, data: { email: string; code: string }) {
    console.log("verificationExistsUser in authService", data)
    const cache = this.cacheService.get(data.email);
    if (!cache || cache.code !== Number(data.code)) {
      throw new UnauthorizedException('Invalid OTP or expired');
    }

    const user = await this.prisma.user.findUnique({where : {id : userId}});
    if (!user) throw new NotFoundException('User not found!');

    return {
      accessToken: await this.jwtService.getAccessToken(user),
      user,
      routerUrl: '/',
    };
  }

  async createUserAndVerifiyCode(data: {email:string,code :string}) {
    const cache = this.cacheService.get(data.email);

    console.log("createUserAndVerifiyCode in authService", cache)
    if (!cache || cache.code != parseInt(data.code)) {
      throw new UnauthorizedException('Invalid OTP or expired');
    }

    const exists = await this.userService.findByEMail(data.email);
    if (exists) {
      throw new UnauthorizedException('User already exists, use login!');
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.email.split('@')[0],
      },
    });

    return {
      accessToken: await this.jwtService.getAccessToken(user),
      user,
      routerUrl: '/create/profile',
    };
  }
}
