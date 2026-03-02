import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Gérer les cookies (nécessaire pour l'authentification si tu utilises des cookies)
  app.use(cookieParser());

  // 2. Configuration dynamique des CORS
  // On récupère l'URL du front depuis les variables d'environnement (Render)
  const allowedOrigins = [
    "http://localhost:5173",          // Dev local
    process.env.CORS_ORIGIN,          // Prod (URL Vercel sans slash final)
  ].filter(Boolean) as string[];      // Supprime les entrées vides si la variable n'est pas définie

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });

  // 3. Documentation Swagger
  const config = new DocumentBuilder()
    .setTitle("API Adoption Animaux")
    .setDescription(
      "Documentation complète de l'API pour la plateforme d'adoption d'animaux"
    )
    .setVersion("1.0")
    .addTag("animals", "Gestion des animaux")
    .addTag("applications", "Gestion des demandes d'adoption")
    .addTag("auth", "Authentification et autorisation")
    .addTag("bookmarks", "Gestion des favoris")
    .addTag("emails", "Envoi d'emails")
    .addTag("shelters", "Gestion des refuges")
    .addTag("species", "Liste des espèces")
    .addTag("users", "Gestion des utilisateurs")
    .addTag("health", "État de santé de l'API")
    .addTag("app", "Routes générales")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // 4. Validation globale (Pipes)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,         // Supprime les propriétés non autorisées dans les DTOs
    forbidNonWhitelisted: true,
    transform: true,         // Transforme les types automatiquement (ex: string vers number)
  }));

  // 5. Lancement du serveur
  // Render injecte automatiquement une variable PORT
  const port = process.env.PORT || 3001;
  
  // '0.0.0.0' est indispensable pour que le service soit accessible sur Render
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Serveur démarré sur le port : ${port}`);
  console.log(`✅ Origines CORS autorisées : ${allowedOrigins.join(', ')}`);
}

bootstrap();