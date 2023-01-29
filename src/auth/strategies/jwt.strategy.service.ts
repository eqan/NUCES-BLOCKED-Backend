import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

// Extracts Jwt token from first the cookies and then tries to fetch it from the headers.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: (req: any) => {
        try {
          const jwtToken = req.headers?.authorization;
          if (jwtToken) {
            return jwtToken.replace('Bearer ', '');
          }
        } catch (err) {
          throw new UnauthorizedException('Authorization token not found!');
        }
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  n;

  async validate(payload: any) {
    return { payload, id: payload.sub };
  }
}
