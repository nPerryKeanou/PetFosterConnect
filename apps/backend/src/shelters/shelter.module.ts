import { Module } from "@nestjs/common";
import { ShelterService } from "./shelter.service";
import { ShelterController } from "./shelter.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [ShelterController],
  providers: [ShelterService, PrismaService],
})
export class ShelterModule {}
