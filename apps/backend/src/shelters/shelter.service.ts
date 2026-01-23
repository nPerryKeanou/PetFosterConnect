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
      where: {
        user: {
          deletedAt: null,
        },
      },
      include: {
        user: { include: { animals: true } },
      },
    });
  }

  async findOne(id: number) {
    const shelter = await this.prisma.shelterProfile.findUnique({
      where: { pfcUserId: id },
      include: {
        user: { include: { animals: true } },
      },
    });

    if (!shelter || shelter.user.deletedAt) {
      throw new NotFoundException("Refuge introuvable");
    }

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
