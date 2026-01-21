import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateApplicationDto, 
  UpdateApplicationStatusDto 
} from '@projet/shared-types';
import { ApplicationType, ApplicationStatus } from '@prisma/client'; // Enums Prisma

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  // Créer une demande (Candidat)
  async create(userId: number, createDto: CreateApplicationDto) {
    return this.prisma.application.create({
      data: {
        pfcUserId: userId,
        animalId: createDto.animalId,
        message: createDto.message,
        // On cast les enums Zod vers Prisma si nécessaire (souvent compatibles si strings identiques)
        applicationType: createDto.applicationType as ApplicationType,
        applicationStatus: 'pending', // Défaut
      },
    });
  }

  // Voir mes demandes envoyées (Candidat)
  findAllSent(userId: number) {
    return this.prisma.application.findMany({
      where: { 
        pfcUserId: userId,
        deletedAt: null // On exclut les archivées
      },
      include: {
        animal: true, // On veut voir pour quel animal on a postulé
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Voir les demandes reçues (Refuge)
  // On cherche les demandes sur les animaux qui appartiennent à ce refuge
  findAllReceived(shelterId: number) {
    return this.prisma.application.findMany({
      where: {
        animal: {
          pfcUserId: shelterId // Le propriétaire de l'animal
        },
        deletedAt: null
      },
      include: {
        animal: {
          select: { name: true, photos: true, id: true } // Juste l'essentiel de l'animal
        },
        user: { 
          include: {
            individualProfile: true // Pour voir les critères (jardin, enfants...) du candidat
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mettre à jour le statut (Refuge)
  async updateStatus(
    candidateId: number, 
    animalId: number, 
    updateDto: UpdateApplicationStatusDto
  ) {
    return this.prisma.application.update({
      where: {
        // Syntaxe Prisma pour clé composite @@id([pfc_user_id, animal_id])
        pfcUserId_animalId: {
          pfcUserId: candidateId,
          animalId: animalId,
        },
      },
      data: {
        applicationStatus: updateDto.applicationStatus as ApplicationStatus,
      },
    });
  }

  // Supprimer/Archiver (Soft Delete)
  remove(candidateId: number, animalId: number) {
    return this.prisma.application.update({
      where: {
        pfcUserId_animalId: {
          pfcUserId: candidateId,
          animalId: animalId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}