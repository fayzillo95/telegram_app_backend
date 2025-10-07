import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request } from 'express';
import {
  decodeToken,
  getToken,
  jwtTokenType,
  jwtTokenTypeEnum,
} from 'src/common/config/jwt.secrets';

@Injectable()
export class JwtSubService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getAccessToken(user: User) {
    const { id  } = user;
    const token = await getToken(
      this.jwtService,
      { id  },
      this.configService,
    );
    return token;
  }

  async getSessionToken(user : User){
    const {id} = user
    const token = await getToken(this.jwtService,{id},this.configService,jwtTokenTypeEnum.SESSION)
    return token
  }

  async getRefreshToken(user: User) {
    const { id } = user;
    const token = await getToken(
      this.jwtService,
      { id  },
      this.configService,
      jwtTokenTypeEnum.REFRESH,
    );
    return token;
  }

  async verifyToken<T>(token: string, type: jwtTokenType): Promise<T> {
    const result: T = await decodeToken<T>(
      this.jwtService,
      token,
      this.configService,
      type,
    );
    return result;
  }
}