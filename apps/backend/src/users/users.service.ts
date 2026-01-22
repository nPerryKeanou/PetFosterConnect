import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client"; 
import { RegisterDto } from "@projet/shared-types";
import { UpdateUserWithIndividualProfileDto, UpdateUserWithShelterProfileDto } from "../../../../packages/shared-types/src/UpdateUserWithProfilUser.shema"; 


import * as argon2 from "argon2";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // --- Création d'un utilisateur ---
  async create(data: RegisterDto) {
    const hashedPassword = await argon2.hash(data.password);
    return this.prisma.pfcUser.create({
      data: {
        email: data.email,
        password: hashedPassword,
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

  // --- Récupérer un utilisateur par email ---
  async findByEmail(email: string) {
    return this.prisma.pfcUser.findUnique({ where: { email } });
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
  
  // --- Mise à jour du profil particulier ---
  
    async updateIndividualProfile(id: number, dto: UpdateUserWithIndividualProfileDto) {
      return this.prisma.pfcUser.update({
        where: { id },
        data: {
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          individualProfile: {
            update: {
              surface: dto.surface,
              housingType: dto.housingType,
              haveGarden: dto.haveGarden,
              haveAnimals: dto.haveAnimals,
              haveChildren: dto.haveChildren,
              availableFamily: dto.availableFamily,
              availableTime: dto.availableTime,
            },
          },
        },
        include: { individualProfile: true },
      });
    }
  
    async updateShelterProfile(id: number, dto: UpdateUserWithShelterProfileDto) {
      return this.prisma.pfcUser.update({
        where: { id },
        data: {
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          shelterProfile: {
            update: {
              shelterName: dto.shelterName,
              description: dto.description,
              logo: dto.logo,
            },
          },
        },
        include: { shelterProfile: true },
      });
    }
  }
  