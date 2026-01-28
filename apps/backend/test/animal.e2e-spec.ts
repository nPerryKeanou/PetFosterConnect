import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Animals (E2E) - Démarrage', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /animals - Devrait répondre (même si vide)', async () => {
    const response = await request(app.getHttpServer())
      .get('/animals')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});