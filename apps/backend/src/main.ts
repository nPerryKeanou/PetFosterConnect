import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //gérer les cookies
  app.use(cookieParser());

  // Autoriser les requêtes CORS depuis le frontend
  app.enableCors({
    origin: "http://localhost:5173", // Vite
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.useGlobalPipes();

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
