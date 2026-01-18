import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies?.access_token,
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload) {
    return { userId: payload.sub };
  }
}
