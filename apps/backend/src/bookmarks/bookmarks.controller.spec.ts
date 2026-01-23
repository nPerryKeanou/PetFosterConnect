import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksController } from './bookmarks.controller';
import { BookMarksService } from './bookmarks.service';

describe('BookmarksController', () => {
  let controller: BookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [BookMarksService],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
