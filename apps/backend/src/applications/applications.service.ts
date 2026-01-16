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
        pfc_user_id: userId,
        animal_id: createDto.animal_id,
        message: createDto.message,
        // On cast les enums Zod vers Prisma si nécessaire (souvent compatibles si strings identiques)
        application_type: createDto.application_type as ApplicationType,
        application_status: 'pending', // Défaut
      },
    });
  }

  // Voir mes demandes envoyées (Candidat)
  findAllSent(userId: number) {
    return this.prisma.application.findMany({
      where: { 
        pfc_user_id: userId,
        deleted_at: null // On exclut les archivées
      },
      include: {
        animal: true, // On veut voir pour quel animal on a postulé
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // Voir les demandes reçues (Refuge)
  // On cherche les demandes sur les animaux qui appartiennent à ce refuge
  findAllReceived(shelterId: number) {
    return this.prisma.application.findMany({
      where: {
        animal: {
          pfc_user_id: shelterId // Le propriétaire de l'animal
        },
        deleted_at: null
      },
      include: {
        animal: {
          select: { name: true, photos: true, id: true } // Juste l'essentiel de l'animal
        },
        user: { 
          include: {
            individual_profile: true // Pour voir les critères (jardin, enfants...) du candidat
          }
        }
      },
      orderBy: { created_at: 'desc' },
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
        pfc_user_id_animal_id: {
          pfc_user_id: candidateId,
          animal_id: animalId,
        },
      },
      data: {
        application_status: updateDto.application_status as ApplicationStatus,
      },
    });
  }

  // Supprimer/Archiver (Soft Delete)
  remove(candidateId: number, animalId: number) {
    return this.prisma.application.update({
      where: {
        pfc_user_id_animal_id: {
          pfc_user_id: candidateId,
          animal_id: animalId,
        },
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}