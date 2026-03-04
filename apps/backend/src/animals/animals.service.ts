import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAnimalDto, UpdateAnimalDto } from "@projet/shared-types";
import { PrismaService } from "../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import axios from "axios";


// Animal avec relations species + shelterProfile
type AnimalWithRelations = Prisma.AnimalGetPayload<{
  include: { species: true; shelter: { include: { shelterProfile: true } } };
}>;

// Animal enrichi avec isBookmarked
type AnimalWithBookmark = AnimalWithRelations & { isBookmarked: boolean };


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
  
  

  // async findAll(includeDeleted = false, limit?: number) {
  //   return this.prisma.animal.findMany({
  //     where: { 
  //       // Si includeDeleted est false, on ne veut que deletedAt: null
  //       deletedAt: includeDeleted ? undefined : null 
  //     },
  //     take: limit, // On applique la limite si elle est fournie
  //     orderBy: { 
  //       createdAt: 'desc' // On trie toujours du plus récent au plus ancien
  //     },
  //     include: {
  //       species: true,
  //       shelter: { include: { shelterProfile: true } },
  //     },
  //   });
  // }


  async findAll(includeDeleted = false, limit?: number) {
    // 1. Récupération des animaux depuis TA base (Supabase)
    const localAnimals = await this.prisma.animal.findMany({
      where: { deletedAt: includeDeleted ? undefined : null },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        species: true,
        shelter: { include: { shelterProfile: true } },
      },
    });

    // 2. Récupération depuis les APIs externes
    try {
      const [catsRes, dogsRes] = await Promise.all([
        axios.get('https://api.thecatapi.com/v1/images/search?limit=5', {
          headers: { 'x-api-key': process.env.CAT_API_KEY }
        }),
        axios.get('https://api.thedogapi.com/v1/images/search?limit=5', {
          headers: { 'x-api-key': process.env.DOG_API_KEY }
        })
      ]);

      // On transforme les données externes pour qu'elles ressemblent à tes modèles locaux
      const externalAnimals = [
        ...catsRes.data.map(cat => this.mapExternalToLocal(cat, 'Chat')),
        ...dogsRes.data.map(dog => this.mapExternalToLocal(dog, 'Chien'))
      ];

      // On fusionne les deux listes
      return [...localAnimals, ...externalAnimals];
    } catch (error) {
      console.error("Erreur API Externes:", error.message);
      return localAnimals; // Si les APIs externes plantent, on montre au moins le local
    }
  }

  // Petite fonction utilitaire pour formater les données
  private mapExternalToLocal(ext: any, speciesName: string) {
    return {
      id: `ext-${ext.id}`, // On préfixe pour éviter les conflits d'ID avec ta base
      name: `${speciesName} externe`,
      photos: [ext.url],
      species: { name: speciesName },
      shelter: { shelterProfile: { name: "Partenaire Externe" } },
      animalStatus: "AVAILABLE",
      description: "Animal récupéré via API partenaire.",
      age: "Inconnu"
    };
  }
  
  // ... reste de tes méthodes (create, findOne, etc.)


async findOne(id: string | number, userId?: number): Promise<any> {
  // Si l'ID est externe, on renvoie un objet simulé pour ne pas faire planter Prisma
  if (typeof id === 'string' && id.startsWith('ext-')) {
    return {
      id,
      name: "Animal Partenaire",
      description: "Cet animal est disponible via un refuge partenaire externe.",
      photos: [], // On verra comment passer l'image via le frontend juste après
      animalStatus: "AVAILABLE",
      isBookmarked: false,
      species: { name: "Externe" },
      shelter: { shelterProfile: { name: "API Externe" } }
    };
  }

  // Pour les animaux locaux (Supabase), on garde ta logique habituelle
  return this.prisma.animal.findUnique({
    where: { id: Number(id) },
    include: {
      species: true,
      shelter: { include: { shelterProfile: true } },
      bookmarks: userId ? { where: { pfcUserId: userId } } : false,
    },
  });
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

  async findAllByShelter(userId: number) {
    return this.prisma.animal.findMany({
      where: { pfcUserId: userId, deletedAt: null },
      include: {
        species: true,
        shelter: {
          include: {
            shelterProfile: true 
          }
        }
      }
    });
  }
}
