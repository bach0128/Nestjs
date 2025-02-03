import { Injectable } from '@nestjs/common';
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
    return {
      code: 200,
      status: 'success',
      data: {
        access_token: this.jwtService.sign(payload),
      },
    };
  }
}
