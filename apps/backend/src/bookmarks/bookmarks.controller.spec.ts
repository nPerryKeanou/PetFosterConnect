import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';
import { BookMarksService } from './bookmarks.service';

describe('BookmarksController', () => {
  let controller: BookmarksController;
  let service: BookMarksService;

  const mockService = {
    toggle: jest.fn(),
    findAllByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [{ provide: BookMarksService, useValue: mockService }],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
    service = module.get<BookMarksService>(BookMarksService);
  });

  it('devrait appeler toggle avec les bons IDs', async () => {
    const userId = 1;
    const animalId = 99;
    const req = { user: { id: userId } };
    
    mockService.toggle.mockResolvedValue({ bookmarked: true, message: 'Ajouté' });

    await controller.toggle(animalId, req as any); // Ajuste selon si ton controller prend un DTO ou un @Param
    expect(service.toggle).toHaveBeenCalledWith(userId, animalId);
  });
});