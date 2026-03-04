import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import axios from "axios";

@Injectable()
export class AnimalsService {
  constructor(private prisma: PrismaService) {}

  // 1. RECHERCHE TOUS (Inclus les API externes)
  async findAll(includeDeleted = false, limit?: number) {
    const localAnimals = await this.prisma.animal.findMany({
      where: { deletedAt: includeDeleted ? undefined : null },
      take: limit,
      include: { species: true, shelter: { include: { shelterProfile: true } } },
    });

    try {
      const [cats, dogs] = await Promise.all([
        axios.get('https://api.thecatapi.com/v1/images/search?limit=5', { headers: { 'x-api-key': process.env.CAT_API_KEY } }),
        axios.get('https://api.thedogapi.com/v1/images/search?limit=5', { headers: { 'x-api-key': process.env.DOG_API_KEY } })
      ]);
      const external = [
        ...cats.data.map(c => ({ id: `ext-${c.id}`, name: "Chat Partenaire", photos: [c.url], species: { name: "Chat" }, shelter: { shelterProfile: { shelterName: "API" } } })),
        ...dogs.data.map(d => ({ id: `ext-${d.id}`, name: "Chien Partenaire", photos: [d.url], species: { name: "Chien" }, shelter: { shelterProfile: { shelterName: "API" } } }))
      ];
      return [...localAnimals, ...external];
    } catch { return localAnimals; }
  }

  // 2. RECHERCHE UN SEUL (Fix pour le crash ext-)
  async findOne(id: string | number) {
    if (typeof id === 'string' && id.startsWith('ext-')) {
      return { id, name: "Animal Partenaire", photos: [], species: { name: "Externe" }, shelter: { shelterProfile: { shelterName: "Partenaire" } } };
    }
    return this.prisma.animal.findUnique({
      where: { id: Number(id) },
      include: { species: true, shelter: { include: { shelterProfile: true } } }
    });
  }

  // 3. LA MÉTHODE QUI MANQUAIT (Celle qui bloquait le build !)
  async findAllByShelter(userId: number) {
    return this.prisma.animal.findMany({
      where: { pfcUserId: userId, deletedAt: null },
      include: { species: true, shelter: { include: { shelterProfile: true } } }
    });
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
}
