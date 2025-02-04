import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secretKey_secretKey_123_987_654',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const userEmail = payload.email;
    const user = await this.userService.findOne(userEmail);
    const [password, ...rest] = user.password.split('.');
    return user;
  }
}
