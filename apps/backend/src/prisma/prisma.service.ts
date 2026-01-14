import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  async onModuleInit() {
    // Se connecte à la base de données au démarrage du module
    await this.$connect();
  }

  async onModuleDestroy() {
    // Ferme proprement la connexion à la base de données quand le serveur s'arrête
    await this.$disconnect();
  }
}