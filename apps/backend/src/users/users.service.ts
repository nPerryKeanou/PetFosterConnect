import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client"; // On utilise l'Enum Prisma
import { RegisterDto } from "@projet/shared-types";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  // declaration d'une propriété prisma
  constructor(private prisma: PrismaService) {}

  // Utilise le DTO au lieu de re-déclarer les types { email: string... }
  async create(data: RegisterDto) {
    return this.prisma.pfcUser.create({
      // Vérifie si c'est pfc_user ou pfcUser avec ton IDE
      data: {
        email: data.email,
        password: data.password,
        // On force le typage si Prisma ne le reconnaît pas automatiquement via le DTO
        role: data.role as UserRole,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    });
  }
  // creation de la fonction trouver tous les users
  findAll() {
    return this.prisma.pfcUser.findMany();
  }
  // creation de la fonction trouver un user
  findOne(id: number) {
    return this.prisma.pfcUser.findUnique({ where: { id } });
  }

  // Utilise Partial<RegisterDto> pour l'update
  async update(id: number, data: Partial<RegisterDto>) {
    const updateData = { ...data }; // Copie pour ne pas muter l'objet

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    // Si le rôle est mis à jour, on le cast aussi
    if (updateData.role) {
      (updateData as any).role = updateData.role as UserRole;
    }

    return this.prisma.pfcUser.update({
      where: { id },
      data: updateData,
    });
  }

  // suppression d'un user
  remove(id: number) {
    // Soft Delete (Préférence par rapport au delete physique)
    return this.prisma.pfcUser.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Vérifie email + mot de passe
  async validateUser(email: string, plainPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await argon2.verify(user.password, plainPassword);
    if (!isValid) return null;

    return user;
  }

  // Recherche d’un user par email
  async findByEmail(email: string) {
    return this.prisma.pfcUser.findUnique({
      where: { email },
    });
  }
}
