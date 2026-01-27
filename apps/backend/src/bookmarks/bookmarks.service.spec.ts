import { Test, TestingModule } from '@nestjs/testing';
import { BookMarksService } from './bookmarks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookmarksService', () => {
  let service: BookMarksService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookMarksService, PrismaService], // ✅ ajoute PrismaService
    }).compile();

    service = module.get<BookMarksService>(BookMarksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
