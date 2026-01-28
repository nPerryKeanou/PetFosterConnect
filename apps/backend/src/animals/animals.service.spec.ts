import { Test, TestingModule } from '@nestjs/testing';
import { AnimalsService } from './animals.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AnimalsService', () => {
    let service: AnimalsService;

    // 1. LE SIMULATEUR (MOCK)
    // On prépare toutes les fonctions que Prisma utilise dans le service
    const mockPrisma = {
        animal: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    // 2. MISE EN PLACE
    beforeEach(async () => {
        jest.clearAllMocks(); // On vide la mémoire des tests précédents
        
        // On utilise l'instanciation manuelle pour éviter les soucis de monorepo
        service = new AnimalsService(mockPrisma as any);
    });

    // --- TEST : FIND ONE ---
    describe('findOne', () => {
        it('devrait retourner un animal spécifique avec son statut de favori', async () => {
            const fakeAnimal = {
                id: 1,
                name: 'Rex',
                bookmarks: [], // Simule qu'aucun utilisateur n'a mis cet animal en favori
                species: { name: 'Chien' },
                shelter: { shelterProfile: { name: 'SPA' } },
            };

            mockPrisma.animal.findUnique.mockResolvedValue(fakeAnimal);

            const result = await service.findOne(1);

            expect(result.name).toBe('Rex');
            expect(result.isBookmarked).toBe(false); // La logique du service transforme bookmarks[] en boolean
        });

        it('devrait lancer une erreur 404 si l animal n existe pas', async () => {
            mockPrisma.animal.findUnique.mockResolvedValue(null);
            await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
        });
    });

    // --- TEST : CREATE ---
    describe('create', () => {
        it('devrait créer un animal et formater correctement les relations Prisma', async () => {
            // Données envoyées par le front
            const dto = {
                name: 'Pongo',
                speciesId: 10,
                weight: 12.5,
            };
            const userId = 5; // ID du refuge

            // Simulation de la réponse Prisma
            mockPrisma.animal.create.mockResolvedValue({ id: 100, ...dto });

            const result = await service.create(dto as any, userId);

            // On vérifie que le service a bien construit l'objet "data" pour Prisma
            expect(mockPrisma.animal.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    name: 'Pongo',
                    shelter: { connect: { id: userId } }, // Vérifie le lien refuge
                    species: { connect: { id: 10 } },    // Vérifie le lien espèce
                })
            });
            expect(result.id).toBe(100);
        });
    });

    // --- TEST : FIND ALL BY SHELTER ---
    describe('findAllByShelter', () => {
        it('devrait filtrer les animaux par l ID du refuge', async () => {
            const shelterId = 1;
            const fakeList = [{ id: 1, name: 'Rex' }, { id: 2, name: 'Max' }];
            
            mockPrisma.animal.findMany.mockResolvedValue(fakeList);

            const result = await service.findAllByShelter(shelterId);

            // Vérifie que la requête Prisma contient le bon filtre "where"
            expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
                where: { pfcUserId: shelterId },
                include: expect.any(Object)
            });
            expect(result).toHaveLength(2);
        });
    });

    // --- TEST : UPDATE ---
    describe('update', () => {
        it('devrait modifier les données de l animal', async () => {
            const dto = { name: 'Rex Junior' };
            mockPrisma.animal.update.mockResolvedValue({ id: 1, name: 'Rex Junior' });

            const result = await service.update(1, dto);

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining({ name: 'Rex Junior' })
            });
            expect(result.name).toBe('Rex Junior');
        });
    });

    // --- TEST : REMOVE (SOFT DELETE) ---
    describe('remove', () => {
        it('devrait faire un "soft delete" en mettant à jour la date deletedAt', async () => {
            // Dans ton service, remove ne supprime pas, il fait un update de deletedAt
            mockPrisma.animal.update.mockResolvedValue({ id: 1, deletedAt: new Date() });

            await service.remove(1);

            // On vérifie que Prisma a reçu une date pour deletedAt au lieu d'une suppression réelle
            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { deletedAt: expect.any(Date) }
            });
        });
    });
});