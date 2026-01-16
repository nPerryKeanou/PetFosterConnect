import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UsePipes } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { ZodPipe } from '../common/pipes/zod.pipe';
// import type { CreateAnimalSchema, UpdateAnimalSchema, CreateAnimalDto, UpdateAnimalDto } from '@projet/shared-types';

// On importe les SCHÉMAS (valeurs) normalement
import { CreateAnimalSchema, UpdateAnimalSchema } from '@projet/shared-types';

// On importe les DTOS (types) avec 'type'
import type { CreateAnimalDto, UpdateAnimalDto } from '@projet/shared-types';


@Controller('animals')
export class AnimalsController {
  constructor(private readonly animalsService: AnimalsService) {}

  @Post()
  @UsePipes(new ZodPipe(CreateAnimalSchema))
  create(@Body() createAnimalDto: CreateAnimalDto) {
    const mockUserId = 1; // Simulation en attendant l'Auth
    return this.animalsService.create(createAnimalDto, mockUserId);
  }

  @Get()
  findAll() {
    return this.animalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.animalsService.findOne(id);
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


// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AnimalsService } from './animals.service';
// import { CreateAnimalDto } from './dto/create-animal.dto';
// import { UpdateAnimalDto } from './dto/update-animal.dto';

// @Controller('animals')
// export class AnimalsController {
//   constructor(private readonly animalsService: AnimalsService) {}

//   @Post()
//   create(@Body() createAnimalDto: CreateAnimalDto) {
//     return this.animalsService.create(createAnimalDto);
//   }

//   @Get()
//   findAll() {
//     return this.animalsService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.animalsService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
//     return this.animalsService.update(+id, updateAnimalDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.animalsService.remove(+id);
//   }
// }
