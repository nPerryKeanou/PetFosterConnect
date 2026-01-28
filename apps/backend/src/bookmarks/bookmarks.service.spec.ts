import { Test, TestingModule } from '@nestjs/testing';
import { BookMarksService } from './bookmarks.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('BookMarksService', () => {
  let service: BookMarksService;
  let prisma: PrismaService;

  const mockPrisma = {
    animal: { findUnique: jest.fn() },
    bookmark: { findUnique: jest.fn(), create: jest.fn(), delete: jest.fn(), findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookMarksService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<BookMarksService>(BookMarksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('devrait lever une erreur si animal inexistant', async () => {
    mockPrisma.animal.findUnique.mockResolvedValue(null);
    await expect(service.toggle(1, 999)).rejects.toThrow(NotFoundException);
  });

  it('devrait créer un favori s il n existe pas', async () => {
    mockPrisma.animal.findUnique.mockResolvedValue({ id: 99 });
    mockPrisma.bookmark.findUnique.mockResolvedValue(null); // N'existe pas encore

    const result = await service.toggle(1, 99);
    expect(result.bookmarked).toBe(true);
    expect(mockPrisma.bookmark.create).toHaveBeenCalled();
  });

  it('devrait supprimer un favori s il existe déjà', async () => {
    mockPrisma.animal.findUnique.mockResolvedValue({ id: 99 });
    mockPrisma.bookmark.findUnique.mockResolvedValue({ pfcUserId: 1, animalId: 99 });

    const result = await service.toggle(1, 99);
    expect(result.bookmarked).toBe(false);
    expect(mockPrisma.bookmark.delete).toHaveBeenCalled();
  });
});