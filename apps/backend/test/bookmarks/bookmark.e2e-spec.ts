import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtAuthGuard } from '../../src/auth/auth.guard'; 

describe('Bookmarks (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userId: number;
  let animalId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: (ctx) => {
        const req = ctx.switchToHttp().getRequest();
        req.user = { id: userId }; // Bypass auth
        return true;
    }})
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);

    // Clean DB
    await prisma.bookmark.deleteMany();
    await prisma.animal.deleteMany();
    await prisma.pfcUser.deleteMany();
    await prisma.species.deleteMany();

    // Setup Data
    const user = await prisma.pfcUser.create({ data: { email: 'fav@test.com', password: '123', role: 'individual' } });
    userId = user.id;
    const species = await prisma.species.create({ data: { name: 'Chat' } });
    const animal = await prisma.animal.create({
      data: { name: 'Pongo', speciesId: species.id, pfcUserId: user.id, animalStatus: 'available', sex: 'male' }
    });
    animalId = animal.id;
  });

  afterAll(async () => { await app.close(); });

  it('POST /bookmarks/:id -> devrait ajouter puis retirer (Toggle)', async () => {
    // 1. On ajoute
    const resAdd = await request(app.getHttpServer()).post(`/bookmarks/${animalId}`).expect(201);
    expect(resAdd.body.bookmarked).toBe(true);

    // 2. On vérifie en base
    const fav = await prisma.bookmark.findUnique({ where: { pfcUserId_animalId: { pfcUserId: userId, animalId } } });
    expect(fav).toBeDefined();

    // 3. On toggle encore (donc supprime)
    const resRem = await request(app.getHttpServer()).post(`/bookmarks/${animalId}`).expect(201);
    expect(resRem.body.bookmarked).toBe(false);
  });

  it('GET /bookmarks -> devrait lister les favoris avec les infos espèces', async () => {
    // On recrée le favori pour le test
    await prisma.bookmark.create({ data: { pfcUserId: userId, animalId: animalId } });

    const res = await request(app.getHttpServer()).get('/bookmarks').expect(200);
    expect(res.body[0].animal.name).toBe('Pongo');
    expect(res.body[0].animal.species.name).toBe('Chat'); // Vérifie ton include !
  });
});