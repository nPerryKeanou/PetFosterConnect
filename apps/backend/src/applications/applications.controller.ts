import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ParseIntPipe, UseGuards, Request 
} from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { ApplicationsService } from './applications.service';
import * as sharedTypes from '@projet/shared-types';
import { ZodPipe } from '../common/pipes/zod.pipe';
import { ApplicationStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('applications')
// Toutes les routes nécessitent d'être connecté
@UseGuards(JwtAuthGuard) 
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly emailService: EmailService,
  ) {}

  // CANDIDAT

  // Créer une demande
  @Post()
  @UsePipes(new ZodPipe(sharedTypes.CreateApplicationSchema))
  create(
    @Request() req, 
    @Body() createApplicationDto: sharedTypes.CreateApplicationDto
  ) {
    // req.user.id est extrait automatiquement du Token
    return this.applicationsService.create(req.user.id, createApplicationDto);
  }

  // Mes demandes envoyées
  @Get("sent")
  findAllSent(@Request() req) {
    return this.applicationsService.findAllSent(req.user.id);
  }

  // REFUGE

  // Demandes reçues par le refuge
  @Get("received")
  findAllReceived(@Request() req) {
    return this.applicationsService.findAllReceived(req.user.id);
  }
  
  // GESTION (Refuge)

  // Note : Pour les actions spécifiques sur une candidature précise, 
  // on garde les IDs dans l'URL car on cible une ressource spécifique, pas "moi".

  // Accepter/Refuser (Mise à jour statut générique)
  @Patch(':animalId/:candidateId')
  @UsePipes(new ZodPipe(sharedTypes.UpdateApplicationStatusSchema))
  update(
    @Param('animalId', ParseIntPipe) animalId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() updateDto: sharedTypes.UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(candidateId, animalId, updateDto);
  }

  // Archiver / Supprimer
  @Delete(':animalId/:candidateId')
  remove(
    @Param('animalId', ParseIntPipe) animalId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ) {
    return this.applicationsService.remove(candidateId, animalId);
  }

  // Raccourci : Accepter
  @Post(':candidateId/:animalId/accept')
  async accept(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('animalId', ParseIntPipe) animalId: number,
  ) {
    // D'abord, on met à jour la base de données (C'est le plus important)
    const application = await this.applicationsService.updateStatus(candidateId, animalId, {
      applicationStatus: ApplicationStatus.approved,
    });
  
    // Ensuite, on tente d'envoyer l'email (Non bloquant)
    try {
        if (application.user?.email) {
            // Astuce : On utilise une valeur de secours si le prénom n'est pas dispo
            const firstname = (application.user.individualProfile as any)?.firstname || "Candidat";

            await this.emailService.sendAcceptanceEmail(
                application.user.email,
                firstname, 
                application.animal.name,
            );
        }
    } catch (error) {
        // Si l'email plante (ex: pas de SMTP), on loggue l'erreur mais on ne casse pas la requête
        console.error("⚠️ [Email Error] Impossible d'envoyer l'email d'acceptation :", error.message);
    }
  
    // On renvoie quand même le succès au front, car la mise à jour BDD est faite
    return { message: 'Candidature acceptée (Notification email traitée)', application };
  }
  
  // Raccourci : Refuser
  @Post(':candidateId/:animalId/reject')
  async reject(
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Param('animalId', ParseIntPipe) animalId: number,
  ) {
    const application = await this.applicationsService.updateStatus(candidateId, animalId, {
      applicationStatus: ApplicationStatus.rejected,
    });
  
    // Protection anti-crash pour l'email
    try {
        if (application.user?.email) {
            const firstname = (application.user.individualProfile as any)?.firstname || "Candidat";

            await this.emailService.sendRejectionEmail(
                application.user.email,
                firstname,
                application.animal.name,
            );
        }
    } catch (error) {
        console.error("⚠️ [Email Error] Impossible d'envoyer l'email de refus :", error.message);
    }
  
    return { message: 'Candidature refusée', application };
  }
}