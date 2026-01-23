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

async findAll() {
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

/**
   * Trouve un animal et vérifie si l'utilisateur l'a mis en favori.
   */
async findOne(id: number, userId?: number) {
  // 1. On cherche l'animal
  const animal = await this.prisma.animal.findUnique({
    where: { id: Number(id) },
    include: { 
      species: true, 
      shelter: { include: { shelterProfile: true } } 
    },
  });

  if (!animal || animal.deletedAt)
    throw new NotFoundException("Animal non trouvé");

  // 2. Initialisation de l'état du favori
  let isBookmarked = false;
  // 3. Si un utilisateur est connecté, on vérifie l'existence d'un bookmark en base
  if (userId) {
    // On récupère TOUS les favoris de l'utilisateur pour voir ce qui se passe
  const allUserBookmarks = await this.prisma.bookmark.findMany({
    where: { pfcUserId: Number(userId) }
  });
  
    // On force la recherche par les champs individuels
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        pfcUserId: Number(userId),
        animalId: Number(id),
      },
    });

  // Si bookmark existe, on passe isBookmarked à true
    isBookmarked = !!bookmark;
  }
  const result = { ...animal, isBookmarked };
  //4. On retourne l'animal fusionné avec l'info du favori
  return result;
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
