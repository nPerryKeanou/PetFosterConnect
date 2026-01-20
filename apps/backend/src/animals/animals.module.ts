import { Module } from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { AnimalsController } from './animals.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Vérifie bien le chemin
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule], // INDISPENSABLE
  controllers: [AnimalsController],
  providers: [AnimalsService, PrismaService],
})
export class AnimalsModule {}



