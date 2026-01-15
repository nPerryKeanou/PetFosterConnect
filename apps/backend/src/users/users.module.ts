// src/users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [UsersController],   // déclare le contrôleur
  providers: [UsersService, PrismaService], // déclare les services
})
export class UsersModule {}
