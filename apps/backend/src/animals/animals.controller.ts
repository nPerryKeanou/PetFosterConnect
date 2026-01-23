import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UsePipes, UseGuards, Req } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { ZodPipe } from '../common/pipes/zod.pipe';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard'; // Import du nouveau guard
import { CreateAnimalSchema, UpdateAnimalSchema } from '@projet/shared-types';
import type { CreateAnimalDto, UpdateAnimalDto } from '@projet/shared-types';

@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  create(@Body() createAnimalDto: CreateAnimalDto, @Req() req: any) {
    const userId = req.user.id; // injecté par ton guard JWT
    return this.animalsService.create(createAnimalDto, userId);
  }
  
 
 

  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  /**
   * Récupère un animal par son ID.
   * Utilise OptionalJwtAuthGuard pour identifier l'utilisateur sans bloquer l'accès aux visiteurs.
   */
  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {    // On passe l'id de l'user au service s'il existe
    // Si l'utilisateur est connecté, le Guard remplit req.user
    const userId = req.user?.id;
    // On transmet l'ID de l'animal ET l'éventuel ID utilisateur au service
    return this.animalsService.findOne(id, userId); // <--- Vérifie l'ordre ici
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new ZodPipe(UpdateAnimalSchema)) updateAnimalDto: UpdateAnimalDto) {
    return this.animalsService.update(id, updateAnimalDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.remove(id);
  }
}