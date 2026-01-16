import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  UsePipes, ParseIntPipe 
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import * as sharedTypes from '@projet/shared-types';
import { ZodPipe } from '../common/pipes/zod.pipe';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // CANDIDAT : Créer une demande
  @Post()
  @UsePipes(new ZodPipe(sharedTypes.CreateApplicationSchema))
  create(@Body() createApplicationDto: sharedTypes.CreateApplicationDto) {
    // TODO: Remplacer par l'ID du token JWT (req.user.id)
    const userId = 1; // ID Temporaire pour test (Particulier)
    return this.applicationsService.create(userId, createApplicationDto);
  }

  // CANDIDAT : Mes demandes envoyées
  @Get('sent')
  findAllSent() {
    const userId = 1; // ID Temporaire
    return this.applicationsService.findAllSent(userId);
  }

  // REFUGE : Demandes reçues
  @Get('received')
  findAllReceived() {
    const shelterId = 2; // ID Temporaire pour test (Refuge)
    return this.applicationsService.findAllReceived(shelterId);
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
}