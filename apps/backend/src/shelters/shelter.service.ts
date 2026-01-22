import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateShelterProfileDto, UpdateShelterProfileDto } from "@projet/shared-types";

@Injectable()
export class ShelterService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateShelterProfileDto) {
    return this.prisma.shelterProfile.create({ data });
  }

  async findAll() {
    return this.prisma.shelterProfile.findMany({
      include: {
        user: { include: { animals: true } },
      },
    });
  }

  async findOne(id: number) {
    console.log("Service id reçu:", id);
    const shelter = await this.prisma.shelterProfile.findUnique({
      where: { pfcUserId: id }, // ⚠️ Prisma attend pfcUserId comme clé primaire
      include: {
        user: { include: { animals: true } },
      },
    });

    if (!shelter) throw new NotFoundException("Refuge introuvable");
    return shelter;
  }

  async update(id: number, data: UpdateShelterProfileDto) {
    return this.prisma.shelterProfile.update({
      where: { pfcUserId: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.shelterProfile.delete({
      where: { pfcUserId: id },
    });
  }
}
