import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import * as argon2 from "argon2";

@Injectable()
export class UsersService {
    //declaration d'une propriété prisma
    constructor(private prisma: PrismaService) {}

    // creation de de fonction create 
    async create(data: { email: string; password: string; role: string; phone_number?: string; address?: string }) {
    const passwordHash = await argon2.hash(data.password);
    return this.prisma.user.create({
        data: { 
        email: data.email, 
        passwordHash, 
        role: data.role, 
        phone_number: data.phone_number, 
        address: data.address 
        },
    });
    }
    //creation de la fonction trouver tous les users
    findAll() {
    return this.prisma.user.findMany();
    }
    //creation de la fonction trouver tous un user
    findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
    }

    // creation de la fonction pour modifier un user
    async update(id: number, data: any) {
        // modification du mot de passe
    if (data.password) {
        data.passwordHash = await argon2.hash(data.password);
        delete data.password;
    }
    return this.prisma.user.update({ where: { id }, data });
    }

    // suppression d'un user
    remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
    }
}
