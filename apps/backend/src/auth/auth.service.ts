import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  getAccessToken(userId: number) {
    return this.jwt.sign(
      { sub: userId },
      { secret: process.env.JWT_SECRET, expiresIn: "15m" }
    );
  }

  getRefreshToken(userId: number) {
    return this.jwt.sign(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: "7d" }
    );
  }

  async login(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload); // génère un JWT
  }
}
