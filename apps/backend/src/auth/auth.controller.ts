import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import express from "express";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {} // ✅ injection
  @Post("login")
  @HttpCode(200)
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: express.Response
  ) {
    const token = await this.authService.login(body.email, body.password);

    // pose le cookie HttpOnly
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1h
    });

    return { success: true };
  }
}
