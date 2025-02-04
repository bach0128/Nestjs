import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, id }: { email: string; id: string }) {
    const payload = { email: email, sub: id };
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    this.userService.saveRefreshToken(id, refresh_token);
    return {
      code: 200,
      status: 'success',
      data: {
        access_token: this.jwtService.sign(payload),
        refresh_token: refresh_token,
      },
    };
  }

  async verifyRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken);
    if (decoded) {
      const user = this.userService.verifyRefreshToken(
        refreshToken,
        decoded.sub,
      );
      if (user) {
        return user;
      }
    }
    return false;
  }
}
