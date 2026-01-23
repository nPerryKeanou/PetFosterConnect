import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnimalDto, UpdateAnimalDto } from "@projet/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAnimalDto, userId: number) {
    const data: Prisma.AnimalCreateInput = {
      name: dto.name,
      age: dto.age,
      description: dto.description,
      sex: dto.sex,
      weight: dto.weight ? new Prisma.Decimal(dto.weight) : null,
      height: dto.height,
      animalStatus: dto.animalStatus,
      photos: dto.photos,
      acceptOtherAnimals: dto.acceptOtherAnimals,
      acceptChildren: dto.acceptChildren,
      needGarden: dto.needGarden,
      treatment: dto.treatment,
      shelter: { connect: { id: userId } },   // relation vers PfcUser
      species: { connect: { id: dto.speciesId } }, // relation vers Species
    };
  
    return this.prisma.animal.create({ data });
  }
  
  

  async findAll(includeDeleted = false) {
    return this.prisma.animal.findMany({
      where: { deletedAt: includeDeleted ? undefined : null },
      include: {
        species: true,
        shelter: { include: { shelterProfile: true } },
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: { species: true, shelter: { include: { shelterProfile: true } } },
    });

    if (!animal || animal.deletedAt) throw new NotFoundException("Animal non trouvé");

    let isBookmarked = false;
    if (userId) {
      const bookmark = await this.prisma.bookmark.findFirst({
        where: { pfcUserId: userId, animalId: id },
      });
      isBookmarked = !!bookmark;
    }

    return { ...animal, isBookmarked };
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const data: any = {};
    Object.entries(updateAnimalDto).forEach(([key, value]) => {
      if (value !== undefined) data[key] = value;
    });
    return this.prisma.animal.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.animal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
