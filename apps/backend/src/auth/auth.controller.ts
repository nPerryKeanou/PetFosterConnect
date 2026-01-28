import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { RegisterDto } from "@projet/shared-types";
import express from "express";
import { JwtAuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {} // ✅ injection

  @Post("login")
  async login(
    @Body() dto: { email: string; password: string },
    @Res({ passthrough: true }) res: express.Response
  ) {
    const { user, token } = await this.authService.login(dto);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/",
    });

    return { 
      user, 
      access_token: token 
    };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
    });

    return { message: "Déconnexion réussie" };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: any) {
    return req.user;
  }

  @Post("register")
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: express.Response
  ) {
    const { user, token } = await this.authService.register(dto);

    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    return { 
      user, 
      access_token: token 
    };
  }
}
