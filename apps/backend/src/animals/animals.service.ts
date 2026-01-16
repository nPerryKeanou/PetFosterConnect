import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnimalDto, UpdateAnimalDto } from '@projet/shared-types'; 

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto, userId: number) {
    return this.prisma.animal.create({
      data: {
        ...createAnimalDto,
        pfc_user_id: userId,
        photos: createAnimalDto.photos as any, // Cast pour JsonB
      },
    });
  }

  async findAll() {
    return this.prisma.animal.findMany({
      where: { deleted_at: null },
      include: { species: true },
    });
  }

  async findOne(id: number) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: { species: true },
    });
    if (!animal || animal.deleted_at) throw new NotFoundException('Animal non trouvé');
    return animal;
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    return this.prisma.animal.update({
      where: { id },
      data: {
        ...updateAnimalDto,
        photos: updateAnimalDto.photos as any,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.animal.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}


// import { Injectable } from '@nestjs/common';
// import { CreateAnimalDto } from './dto/create-animal.dto';
// import { UpdateAnimalDto } from './dto/update-animal.dto';

// @Injectable()
// export class AnimalsService {
//   create(createAnimalDto: CreateAnimalDto) {
//     return 'This action adds a new animal';
//   }

//   findAll() {
//     return `This action returns all animals`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} animal`;
//   }

//   update(id: number, updateAnimalDto: UpdateAnimalDto) {
//     return `This action updates a #${id} animal`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} animal`;
//   }
// }
