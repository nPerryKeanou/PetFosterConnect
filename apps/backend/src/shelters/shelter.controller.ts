import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
} from "@nestjs/common";
import * as sharedTypes from "@projet/shared-types";
import { ZodPipe } from "../common/pipes/zod.pipe";
import { ShelterService } from "./shelter.service";

@Controller("shelters")
export class ShelterController {
  constructor(private readonly shelterService: ShelterService) {}

  @Post()
  @UsePipes(new ZodPipe(sharedTypes.CreateShelterProfileSchema))
  create(@Body() body: sharedTypes.CreateShelterProfileDto) {
    return this.shelterService.create(body);
  }

  @Get()
  findAll() {
    return this.shelterService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shelterService.findOne(Number(id));
  }

  @Put(":id")
  @UsePipes(new ZodPipe(sharedTypes.UpdateShelterProfileSchema))
  update(
    @Param("id") id: string,
    @Body() body: sharedTypes.UpdateShelterProfileDto
  ) {
    return this.shelterService.update(Number(id), body);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shelterService.remove(Number(id));
  }
}
