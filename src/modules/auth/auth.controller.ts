import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';

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
  login(@Request() request: any) {
    return this.authService.login(request.user);
  }
}
