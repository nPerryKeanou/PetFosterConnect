import { Module } from "@nestjs/common";
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

/**
 * MODULE RACINE (ROOT MODULE)
 * * Ce module est le chef d'orchestre de l'application NestJS.
 * * - ConfigModule : Initialise la gestion des variables d'environnement (.env).
 * - PrismaModule : Expose la connexion à la base de données (injectable partout).
 * - AppController/Service : Gèrent les requêtes de base pour vérifier le statut de l'API.
 * * @module AppModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Recommandé : rend le .env accessible dans tous les futurs modules
    }),
    PrismaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}