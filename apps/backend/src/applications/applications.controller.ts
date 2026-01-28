import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ParseIntPipe 
} from '@nestjs/common';
import { EmailService } from '../email/email.service'
import { ApplicationsService } from './applications.service';
import * as sharedTypes from '@projet/shared-types';
import { ZodPipe } from '../common/pipes/zod.pipe';
import { ApplicationStatus } from '@prisma/client';

import { string } from 'zod';


@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService,
              private readonly emailService: EmailService,
  ) {}

  // CANDIDAT : Créer une demande
  @Post(":id")
  @UsePipes(new ZodPipe(sharedTypes.CreateApplicationSchema))
  create(
    @Body() createApplicationDto: sharedTypes.CreateApplicationDto,
    @Param("id", ParseIntPipe) userId: number
  ) {
    return this.applicationsService.create(userId, createApplicationDto);
  }

  // CANDIDAT : Mes demandes envoyées
  @Get("sent/:id")
  findAllSent(@Param("id", ParseIntPipe) id: number) {
    return this.applicationsService.findAllSent(id);
  }
  

  // REFUGE : Demandes reçues
  @Get("received/:id")
  findAllReceived(@Param("id", ParseIntPipe) id: number) {
    const shelterId = id; // ID temporaire
    return this.applicationsService.findAllReceived(id);
  }
  

  // REFUGE : Accepter/Refuser
  // On a besoin des 2 IDs pour identifier la demande unique
  @Patch(':animalId/:candidateId')
  @UsePipes(new ZodPipe(sharedTypes.UpdateApplicationStatusSchema))
  update(
    @Param('animalId', ParseIntPipe) animalId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
    @Body() updateDto: sharedTypes.UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(candidateId, animalId, updateDto);
  }

  // ARCHIVER
  @Delete(':animalId/:candidateId')
  remove(
    @Param('animalId', ParseIntPipe) animalId: number,
    @Param('candidateId', ParseIntPipe) candidateId: number,
  ) {
    return this.applicationsService.remove(candidateId, animalId);
  }

    @Post(':candidateId/:animalId/accept')
    async accept(
      @Param('candidateId', ParseIntPipe) candidateId: number,
      @Param('animalId', ParseIntPipe) animalId: number,
    ) {
      const application = await this.applicationsService.updateStatus(candidateId, animalId, {
        applicationStatus: ApplicationStatus.approved,
      });
    
      await this.emailService.sendMail(
        application.user.email,
        'Votre candidature a été acceptée',
        'Félicitations, votre demande a été validée !',
        `<p>Bonjour ${application.user?.email ?? ''},</p>
          <p>Votre candidature pour l’animal <b>${application.animal.name}</b> a été <b>acceptée</b>.</p>`
      );
      if (!application.user?.email) { 
        throw new Error("Email du candidat introuvable"); 
      }
    
      return { message: 'Candidature acceptée et email envoyé', application };
    }
    
    @Post(':candidateId/:animalId/reject')
    async reject(
      @Param('candidateId', ParseIntPipe) candidateId: number,
      @Param('animalId', ParseIntPipe) animalId: number,
    ) {
      const application = await this.applicationsService.updateStatus(candidateId, animalId, {
        applicationStatus: ApplicationStatus.rejected,
      });
      if (!application.user?.email) { 
        throw new Error("Email du candidat introuvable"); 
      }
    
      await this.emailService.sendMail(
        application.user.email,
        'Votre candidature a été refusée',
        'Nous sommes désolés, votre demande n’a pas été retenue.',
        `<p>Bonjour ${application.user?.email ?? ''},</p>
          <p>Votre candidature pour l’animal <b>${application.animal.name}</b> a été <b>refusée</b>.</p>`
      );
    
      return { message: 'Candidature refusée et email envoyé', application };
    }

}


 