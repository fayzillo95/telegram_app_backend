import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload, jwtTokenTypeEnum } from 'src/common/config/jwt.secrets';
import { JwtSubService } from 'src/core/jwt/jwt.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/types/auth.types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtSubService: JwtSubService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = await this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) return true;
      const req = context.switchToHttp().getRequest();

      await this.getPayload(req, context);
      return true;
    } catch (error) {
      throw error;
    }
  }
  async getPayload(req: Request, ctx: ExecutionContext) {
    let token: string | undefined;
    const point = req.path.split('/').at(-1);
    const auth = req.headers.authorization;

    if (auth && auth.startsWith('Bearer ')) {
      token = auth.split(' ')[1];
    }
    // console.log("JwtAuthGuard line 42 point", point, token, "salom")

    if (!token) {
      // console.log("JwtAuthGuard line 44 no token in header, checking cookies",req.cookies)
      if (point === 'reset-token') {
        token = req.cookies?.refreshToken;
      } else if (point === 'verification') {
        token = req.cookies?.sessionToken;   // ✅ SESSION token qo‘shildi
      } else {
        token = req.cookies?.accessToken;
      }
    }

    if (!token) {
      throw new UnauthorizedException('Token not found in header or cookie!');
    }

    try {
      if (token.endsWith(",")) {
        token = token.slice(0, -1);
      }

      const type =
        point === 'reset-token'
          ? jwtTokenTypeEnum.REFRESH
          : point === 'verification'
            ? jwtTokenTypeEnum.SESSION   // ✅ SESSION tokenni tekshiradi
            : jwtTokenTypeEnum.ACCESS;

      const user: JwtPayload = await this.jwtSubService.verifyToken<JwtPayload>(
        token,
        type,
      );

      req['user'] = user;
      return true;
    } catch (error) {
      console.log("JwtAuthGuard line 59 error", error)
      throw new UnauthorizedException('Invalid token or expired token!');
    }
  }


}
