import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public, UserData } from 'src/global/decorators/auth.decorators';
import { JwtPayload } from 'src/common/config/jwt.secrets';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.sendOtp(createAuthDto);
  }

  @Public()
  @Post('register/verification')
  async registerVerification(@Body() otpData: {email :string,code :string}) {
    return this.authService.createUserAndVerifiyCode(otpData);
  }

  @Post('exists/verification')
  async existsVerification(
    @UserData() user: JwtPayload,
    @Body() data: { email: string; code: string },
  ) {
    return this.authService.verifyExistsUser(user.id, data);
  }
}
