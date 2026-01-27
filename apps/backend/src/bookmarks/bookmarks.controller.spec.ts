import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';
import { BookMarksService } from './bookmarks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BookmarksController', () => {
  let controller: BookmarksController;
  let service: BookMarksService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [BookMarksService, PrismaService], // ✅ ajoute PrismaService
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
    service = module.get<BookMarksService>(BookMarksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
