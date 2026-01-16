import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon2 from "argon2";
import { RegisterDto } from "@projet/shared-types";
import { UserRole } from "@prisma/client"; // On utilise l'Enum Prisma

@Injectable()
export class UsersService {
  // declaration d'une propriété prisma
  constructor(private prisma: PrismaService) {}

  // Utilise le DTO au lieu de re-déclarer les types { email: string... }
  async create(data: RegisterDto) {
    const passwordHash = await argon2.hash(data.password);

    return this.prisma.pfcUser.create({
      // Vérifie si c'est pfc_user ou pfcUser avec ton IDE
      data: {
        email: data.email,
        password: passwordHash,
        // On force le typage si Prisma ne le reconnaît pas automatiquement via le DTO
        role: data.role as UserRole,
        phone_number: data.phone_number,
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
        data: updateData 
    });
  }

  // suppression d'un user
  remove(id: number) {
    // Soft Delete (Préférence par rapport au delete physique)
    return this.prisma.pfcUser.update({
        where: { id },
        data: { deleted_at: new Date() }
    });
  }
}
