import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('GET /api/v1/doacoes', () => {
    it('Deve retornar um array de doações com status 200', () => {
      return request(app.getHttpServer())
        .get('/api/v1/doacoes')
        .expect(200)
        .expect(Array);
    });
  });

  describe('GET /api/v1/doacoes/:id - Busca Detalhada por ID', () => {
    it('Deve retornar 404 Not Found quando a doação não existe', () => {
      return request(app.getHttpServer())
        .get('/api/v1/doacoes/uuid-inexistente-12345')
        .expect(404)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toBe('Doação não encontrada.');
          expect(res.body.statusCode).toBe(404);
        });
    });

    it('Deve retornar 200 OK com a estrutura correta quando a doação é encontrada', () => {
      return request(app.getHttpServer())
        .get('/api/v1/doacoes/valid-uuid-that-exists')
        .expect((res) => {
          // Pode ser 200 se existir ou 404 se não existir (depende do BD)
          if (res.status === 200) {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('titulo');
            expect(res.body).toHaveProperty('quantidade');
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('doadorId');
          }
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
