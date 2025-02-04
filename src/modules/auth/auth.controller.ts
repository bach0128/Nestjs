import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/register')
  register(@Body() userData: any) {
    return this.userService.create(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  // when user login, data go through LocalAuthGuard, then go to LocalStrategy, so we can get user data from request.user
  login(@Req() request: any) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() request: any) {
    return request.user;
  }

  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }
    const user = await this.authService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }
    return this.authService.login(user);
  }
}
