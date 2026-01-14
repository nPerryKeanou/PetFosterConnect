import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Permet d'utiliser Prisma partout sans l'importer à chaque fois
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}