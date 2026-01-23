import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnimalDto, UpdateAnimalDto } from "@projet/shared-types";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto, userId: number) {
    return this.prisma.animal.create({
      data: {
        ...createAnimalDto,
        pfcUserId: userId,
        photos: createAnimalDto.photos as any, // Cast pour JsonB
      },
    });
  }

async findAll(includeDeleted = false) {
  return this.prisma.animal.findMany({
    where: {
      deletedAt: includeDeleted ? undefined : null,
    },
    include: {
      species: true,    // Récupère l'objet Species (id, name, etc.)
      shelter: {        // Récupère l'utilisateur PfcUser lié
        include: {
          shelterProfile: true // Récupère les détails (shelterName, siret, etc.)
        }
      }
    }
  });
}

  async findOne(id: number) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      include: { 
        species: true, // récupère l'espèce 
      shelter: {       // récupère l'utilisateur qui possède l'animal
        include: {
          shelterProfile: true // récupère les infos du refuge (shelterName, etc.)
        }
      }
      },
    });
    if (!animal || animal.deletedAt)
      throw new NotFoundException("Animal non trouvé");
    return animal;
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    const data: any = {};

    Object.entries(updateAnimalDto).forEach(([key, value]) => {
      if (value !== undefined) {
        data[key] = value;
      }
    });

    return this.prisma.animal.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.animal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
