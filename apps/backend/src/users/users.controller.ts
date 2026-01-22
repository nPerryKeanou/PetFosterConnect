// src/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import * as sharedTypes from "@projet/shared-types";
import { ZodPipe } from "../common/pipes/zod.pipe";

// ⚡ Import des schémas globaux (runtime)
import { 
  UpdateUserWithIndividualProfileSchema, 
  UpdateUserWithShelterProfileSchema 
} from "../../../../packages/shared-types/src/UpdateUserWithProfilUser.shema";

// ⚡ Import des types uniquement pour le typage (compile-time)
import type { 
  UpdateUserWithIndividualProfileDto, 
  UpdateUserWithShelterProfileDto 
} from "../../../../packages/shared-types/src/UpdateUserWithProfilUser.shema";

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

  @Put(":id")
  update(@Param("id") id: string, @Body() body: sharedTypes.UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }

  // --- Profils enrichis ---
  @Get(":id/profil")
  getProfile(@Param("id") id: string) {
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
    @Body() updateDto: UpdateUserWithShelterProfileDto,
  ) {
    return this.usersService.updateShelterProfile(Number(id), updateDto);
  }
}
