import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client"; 
import { 
  RegisterDto, 
  UpdateIndividualProfileDto, 
  UpdateShelterProfileDto 
} from "@projet/shared-types";
import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // --- Création d'un utilisateur ---
  async create(data: RegisterDto) {
    return this.prisma.pfcUser.create({
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

  // --- Récupérer tous les utilisateurs ---
  findAll() {
    return this.prisma.pfcUser.findMany();
  }

  // --- Récupérer un utilisateur par ID ---
  findOne(id: number) {
    return this.prisma.pfcUser.findUnique({ where: { id } });
  }

  // --- Mise à jour d'un utilisateur ---
  async update(id: number, data: Partial<RegisterDto>) {
    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await argon2.hash(updateData.password);
    }

    if (updateData.role) {
      (updateData as any).role = updateData.role as UserRole;
    }

    return this.prisma.pfcUser.update({
      where: { id },
      data: updateData,
    });
  }

  // --- Suppression (soft delete) ---
  remove(id: number) {
    return this.prisma.pfcUser.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // --- Validation login (email + mot de passe) ---
  async validateUser(email: string, plainPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await argon2.verify(user.password, plainPassword);
    if (!isValid) return null;

    return user;
  }

  // --- Récupérer le profil enrichi ---
  async getProfile(userId: number) {
    return this.prisma.pfcUser.findUnique({
      where: { id: userId },
      include: {
        individualProfile: true,
        shelterProfile: true,
      },
    });
  }

  // --- Mise à jour du profil individuel ---
  async updateIndividualProfile(userId: number, data: UpdateIndividualProfileDto) {
    return this.prisma.individualProfile.update({
      where: { pfcUserId: userId },
      data,
    });
  }

  // --- Mise à jour du profil refuge ---
  async updateShelterProfile(userId: number, data: UpdateShelterProfileDto) {
    return this.prisma.shelterProfile.update({
      where: { pfcUserId: userId },
      data,
    });
  }
}
