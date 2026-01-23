import { Test, TestingModule } from '@nestjs/testing';
import { BookMarksService } from './bookmarks.service';

describe('BookmarksService', () => {
  let service: BookMarksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookMarksService],
    }).compile();

    service = module.get<BookMarksService>(BookMarksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
