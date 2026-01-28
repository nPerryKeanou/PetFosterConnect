import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
  Query,
} from "@nestjs/common";
import * as sharedTypes from "@projet/shared-types";
import { ZodPipe } from "../common/pipes/zod.pipe";
import { ShelterService } from "./shelter.service";
import { AnimalsService } from '../animals/animals.service';

@Controller("shelters")
export class ShelterController {
  constructor(private readonly shelterService: ShelterService,
  private readonly animalsService: AnimalsService,
  ) {}

  @Post()
  @UsePipes(new ZodPipe(sharedTypes.CreateShelterProfileSchema))
  create(@Body() body: sharedTypes.CreateShelterProfileDto) {
    return this.shelterService.create(body);
  }

  @Get()
  findAll(@Query('limit') limit?: string) {
    const numericLimit = limit ? parseInt(limit, 10) : undefined;
    return this.shelterService.findAll(numericLimit);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shelterService.findOne(Number(id));
  }

  @Get(':id/animals') // L'URL doit correspondre EXACTEMENT
  findAnimals(@Param('id') id: string) {
  return this.animalsService.findAllByShelter(Number(id));
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
