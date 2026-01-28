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
        deletedAt: null, // On exclut les archivées
      },
      include: {
        animal: true, // L’animal concerné
        user: {       // Le candidat
          select: {
            id: true,
            email: true, 
            phoneNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  

  // Voir les demandes reçues (Refuge)
  // On cherche les demandes sur les animaux qui appartiennent à ce refuge
  
  findAllReceived(shelterId: number) {
    return this.prisma.application.findMany({
      where: {
        animal: {
          pfcUserId: shelterId,
        },
        deletedAt: null,
      },
      select: {
        pfcUserId: true,       // <-- clé primaire
        animalId: true,        // <-- clé primaire
        message: true,
        applicationType: true,
        applicationStatus: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            phoneNumber: true,   // <-- ici le numéro
            individualProfile: true,
          },
        },
        animal: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
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
        pfcUserId_animalId: {
          pfcUserId: candidateId,
          animalId: animalId,
        },
      },
      data: {
        applicationStatus: updateDto.applicationStatus as ApplicationStatus,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            individualProfile: true,
          },
        },
        animal: {
          select: {
            id: true,
            name: true,
            photos: true,
          },
        },
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