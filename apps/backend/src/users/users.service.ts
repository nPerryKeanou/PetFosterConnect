import { Injectable } from "@nestjs/common";
import { UserRole } from "@prisma/client"; 
import { RegisterDto } from "@projet/shared-types";
import { UpdateUserWithIndividualProfileDto, UpdateUserWithShelterProfileDto ,UpdatePasswordDto } from "@projet/shared-types"; 


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
  
    // --- Mise à jour du mot de passe ---
  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    try {
      const user = await this.prisma.pfcUser.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Utilisateur introuvable");
  
      const isValid = await argon2.verify(user.password, dto.oldPassword);
      if (!isValid) throw new Error("Ancien mot de passe incorrect");
  
      const hashed = await argon2.hash(dto.newPassword);
  
      return await this.prisma.pfcUser.update({
        where: { id: userId },
        data: { password: hashed },
      });
    } catch (err) {
      console.error("Erreur updatePassword:", err);
      throw err;
    }
  }
  

    // --- Mise à jour profil individuel ---
    async updateIndividualProfile(id: number, dto: UpdateUserWithIndividualProfileDto) {
      return this.prisma.pfcUser.update({
        where: { id },
        data: {
          email: dto.email,
          phoneNumber: dto.phoneNumber,
          address: dto.address,
          individualProfile: {
            upsert: {
              update: {
                surface: dto.surface,
                housingType: dto.housingType,
                haveGarden: dto.haveGarden,
                haveAnimals: dto.haveAnimals,
                haveChildren: dto.haveChildren,
                availableFamily: dto.availableFamily,
                availableTime: dto.availableTime,
              },
              create: {
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
        },
        include: { individualProfile: true },
      });
    }
  
    // --- Mise à jour profil refuge ---
 async updateShelterProfile(id: number, dto: UpdateUserWithShelterProfileDto) {
   const user = await this.prisma.pfcUser.findUnique({
     where: { id },
     include: { shelterProfile: true },
   });
 
   if (!user) {
     throw new Error("Utilisateur introuvable");
   }
 
   try {
     return await this.prisma.pfcUser.update({
       where: { id },
       data: {
         email: dto.email ?? user.email,
         phoneNumber: dto.phoneNumber ?? user.phoneNumber,
         address: dto.address ?? user.address,
         shelterProfile: {
           upsert: {
             update: {
               siret: dto.siret ?? user.shelterProfile?.siret,
               shelterName: dto.shelterName ?? user.shelterProfile?.shelterName,
               description: dto.description ?? user.shelterProfile?.description ?? null,
               logo: dto.logo ?? user.shelterProfile?.logo ?? null,
             },
             create: {
               siret: dto.siret ?? "00000000000000", // ⚡ obligatoire à la création
               shelterName: dto.shelterName ?? "Nom inconnu",
               description: dto.description ?? null,
               logo: dto.logo ?? null,
             },
           },
         },
       },
       include: { shelterProfile: true },
     });
   } catch (err) {
     console.error("Erreur Prisma updateShelterProfile:", err);
     throw new Error("Impossible de mettre à jour le profil refuge");
   }
 }
 
 
  }

    
