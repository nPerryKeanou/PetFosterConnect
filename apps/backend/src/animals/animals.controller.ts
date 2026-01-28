import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  Query,
} from "@nestjs/common";
import type { CreateAnimalDto, UpdateAnimalDto } from "@projet/shared-types";
import { CreateAnimalSchema, UpdateAnimalSchema } from "@projet/shared-types";
import { JwtAuthGuard } from "../auth/auth.guard";
import { OptionalJwtAuthGuard } from "../auth/optional-jwt-auth.guard";
import { ZodPipe } from "../common/pipes/zod.pipe";
import { AnimalsService } from "./animals.service";

@Controller("animals")
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ZodPipe(CreateAnimalSchema)) dto: CreateAnimalDto,
    @Req() req: any
  ) {
    return this.animalsService.create(dto, req.user.id);
  }

  @Get()
  findAll(
    @Query('limit') limit?: string, 
    @Query('includeDeleted') includeDeleted?: string
  ) {
    // Conversion des Query Params
    const numericLimit = limit ? parseInt(limit, 10) : undefined;
    const isDeletedIncluded = includeDeleted === 'true'; // simple conversion booléenne

    // On passe les deux arguments
    return this.animalsService.findAll(isDeletedIncluded, numericLimit);
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user?.id;
    return this.animalsService.findOne(id, userId);
  }

  @Get("shelter/:id")
  async findByShelter(@Param("id") id: string) {
    return this.animalsService.findAllByShelter(Number(id));
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body(new ZodPipe(UpdateAnimalSchema)) updateAnimalDto: UpdateAnimalDto
  ) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.animalsService.remove(id);
  }
}
