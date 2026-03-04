import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnimalDto, UpdateAnimalDto } from "@projet/shared-types"; // Import réparé
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import axios from "axios";

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  // 1. CRÉATION (Remise en place)
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
      shelter: { connect: { id: userId } },
      species: { connect: { id: dto.speciesId } },
    };
    return this.prisma.animal.create({ data });
  }

  // 2. FIND ALL (Fusion Local + API)
  async findAll(includeDeleted = false, limit?: number) {
    const localAnimals = await this.prisma.animal.findMany({
      where: { deletedAt: includeDeleted ? undefined : null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        species: true,
        shelter: { include: { shelterProfile: true } },
      },
    });

    try {
      const [catsRes, dogsRes] = await Promise.all([
        axios.get('https://api.thecatapi.com/v1/images/search?limit=5', {
          headers: { 'x-api-key': process.env.CAT_API_KEY }
        }),
        axios.get('https://api.thedogapi.com/v1/images/search?limit=5', {
          headers: { 'x-api-key': process.env.DOG_API_KEY }
        })
      ]);

      const externalAnimals = [
        ...catsRes.data.map((cat: any) => this.mapExternalToLocal(cat, 'Chat')),
        ...dogsRes.data.map((dog: any) => this.mapExternalToLocal(dog, 'Chien'))
      ];

      return [...localAnimals, ...externalAnimals];
    } catch (error) {
      return localAnimals;
    }
  }

  // 3. FIND ONE (Unique et corrigée pour les IDs ext-)
  async findOne(id: string | number, userId?: number): Promise<any> {
    if (typeof id === 'string' && id.startsWith('ext-')) {
      return {
        id,
        name: "Animal Partenaire",
        photos: [], 
        species: { name: "Externe" },
        shelter: { shelterProfile: { shelterName: "Partenaire Externe" } },
        description: "Détails disponibles via le partenaire."
      };
    }

    const animal = await this.prisma.animal.findUnique({
      where: { id: Number(id) },
      include: {
        species: true,
        shelter: { include: { shelterProfile: true } },
        bookmarks: userId ? { where: { pfcUserId: userId } } : false,
      },
    });

    if (!animal || animal.deletedAt) throw new NotFoundException("Animal non trouvé");
    const { bookmarks, ...rest } = animal;
    return { ...rest, isBookmarked: !!bookmarks?.length };
  }

  // 4. FIND BY SHELTER (Indispensable pour ton profil)
  async findAllByShelter(userId: number) {
    return this.prisma.animal.findMany({
      where: { pfcUserId: userId, deletedAt: null },
      include: {
        species: true,
        shelter: { include: { shelterProfile: true } }
      }
    });
  }

  // 5. UPDATE ET REMOVE
  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    return this.prisma.animal.update({ 
      where: { id }, 
      data: updateAnimalDto as any 
    });
  }

  async remove(id: number) {
    return this.prisma.animal.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
  }

  private mapExternalToLocal(ext: any, speciesName: string) {
    return {
      id: `ext-${ext.id}`,
      name: `${speciesName} Partenaire`,
      photos: [ext.url],
      species: { name: speciesName },
      shelter: { shelterProfile: { shelterName: "Refuge API" } },
      animalStatus: "available",
      description: "Cet animal est disponible via un refuge partenaire.",
      age: "Inconnu",
      sex: "Inconnu"
    };
  }
}