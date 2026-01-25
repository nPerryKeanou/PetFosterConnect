// src/users/users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
// ⚡ Import des types uniquement pour le typage (compile-time)
import type {
  UpdatePasswordDto,
  UpdateUserWithIndividualProfileDto,
  UpdateUserWithShelterProfileDto,
} from "@projet/shared-types";
import * as sharedTypes from "@projet/shared-types";
// ⚡ Import des schémas globaux (runtime)
import {
  UpdatePasswordSchema,
  UpdateUserWithIndividualProfileSchema,
  UpdateUserWithShelterProfileSchema,
} from "@projet/shared-types";
import { JwtAuthGuard } from "../auth/auth.guard";
import { ProfileAccessGuard } from "../auth/profile-access.guard";
import { ZodPipe } from "../common/pipes/zod.pipe";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // --- CRUD de base sur PfcUser ---
  @Post()
  @UsePipes(new ZodPipe(sharedTypes.RegisterSchema))
  create(@Body() body: sharedTypes.RegisterDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(Number(id));
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: sharedTypes.UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }

  // --- Profils enrichis ---
  @Get(":id/profil")
  @UseGuards(JwtAuthGuard, ProfileAccessGuard)
  getProfile(@Param("id") id: string) {
    console.log("Getting profile for user ID:", id);
    return this.usersService.getProfile(Number(id));
  }

  // --- Mise à jour du profil individuel ---
  @Put(":id/individual-profile")
  @UsePipes(new ZodPipe(UpdateUserWithIndividualProfileSchema))
  async updateIndividualProfile(
    @Param("id") id: string,
    @Body() updateDto: UpdateUserWithIndividualProfileDto
  ) {
    return this.usersService.updateIndividualProfile(Number(id), updateDto);
  }

  // --- Mise à jour du profil refuge ---
  @Put(":id/shelter-profile")
  @UsePipes(new ZodPipe(UpdateUserWithShelterProfileSchema))
  async updateShelterProfile(
    @Param("id") id: string,
    @Body() updateDto: UpdateUserWithShelterProfileDto
  ) {
    return this.usersService.updateShelterProfile(Number(id), updateDto);
  }

  @Put(":id/password") async updatePassword(
    @Param("id") id: string,
    @Body(new ZodPipe(UpdatePasswordSchema)) dto: UpdatePasswordDto
  ) {
    return this.usersService.updatePassword(Number(id), dto);
  }
}
