import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CacheService } from './cache.service';
import { EmailCodeEnum } from 'src/common/types/enum.types';
import { JwtSubService } from '../jwt/jwt.service';
import { CreateOtpDto } from './dto/create-email.dto';
import { userReturnData } from 'src/modules/users/entities/user.entity';

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

  // 📩 1. OTP yuborish
  async sendOtp(data: CreateOtpDto) {
    const exists = await this.userService.findByEmail(data.email);

    // 🔢 Random 6 xonali kod
    const code = Math.floor(100000 + Math.random() * 900000);

    await this.emailService.sendResedPasswordVerify(
      data.email,
      code,
      EmailCodeEnum.REGISTER,
    );

    // ⏱️ Cache’da 5 daqiqa saqlaymiz
    this.cacheService.set(data.email, { email: data.email, code }, 1000 * 60 * 5);

    // 🔐 Agar user mavjud bo‘lsa — verificationUrl farq qiladi
    if (exists) {
      const sessionToken = await this.jwtService.getSessionToken(exists);

      return {
        sessionToken,
        verificationUrl: 'auth/exists/verification',
      };
    }

    return {
      verificationUrl: 'auth/register/verification',
    };
  }

  // ✅ 2. Mavjud foydalanuvchini tasdiqlash
  async verifyExistsUser(userId: string, data: { email: string; code: string }) {
    const cache = this.cacheService.get(data.email);
    if (!cache || cache.code !== Number(data.code)) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        isBot: true,
        lastActivaty: true,
        Profile: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    this.cacheService.delete(data.email);

    return {
      message: 'User verified successfully',
      routerUrl: '/',
      accessToken: await this.jwtService.getAccessToken(user),
      user: userReturnData(user,user.Profile[0])
    };
  }

  // 🧑‍💻 3. Yangi foydalanuvchini yaratish va kodni tekshirish
  async createUserAndVerifiyCode(data: { email: string; code: string }) {
    const cache = this.cacheService.get(data.email);

    if (!cache || cache.code !== Number(data.code)) {
      throw new BadRequestException('Invalid or expired OTP code');
    }

    const exists = await this.userService.findByEmail(data.email);
    if (exists) {
      throw new BadRequestException('User already exists, please log in');
    }

    // 🆕 User yaratish
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.email.split('@')[0],
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        isBot: true,
        lastActivaty: true,
      },
    });

    this.cacheService.delete(data.email);

    return {
      message: 'User created and verified successfully!',
      routerUrl: '/create/profile',
      accessToken: await this.jwtService.getAccessToken(user),
      user,
    };
  }
}
