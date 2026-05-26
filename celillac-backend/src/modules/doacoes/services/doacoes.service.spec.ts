import { Test, TestingModule } from '@nestjs/testing';
import { DoacoesService } from './doacoes.service';
import { DOACOES_REPOSITORY } from '../repositories/doacoes.repository.interface';
import { DoacaoStatusEnum } from 'src/common/doacoes/enums/doacao-status.enum';
import { DoacaoEntity } from '../entities/doacao.entity';

describe('DoacoesService - UC10: Consultar Inventário de Doações', () => {
  let service: DoacoesService;
  let mockRepository: { findAll: jest.Mock };

  beforeEach(async () => {
    mockRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoacoesService,
        {
          provide: DOACOES_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DoacoesService>(DoacoesService);
  });

  describe('listarDoacoes', () => {
    it('Deve retornar um array vazio quando não houver doações cadastradas', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await service.listarDoacoes();

      expect(result).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar um array com todas as doações persistidas', async () => {
      const doacoesMock: DoacaoEntity[] = [
        {
          id: 'uuid-doacao-1',
          titulo: 'Roupas de Inverno',
          quantidade: 10,
          status: DoacaoStatusEnum.DISPONIVEL,
          doadorId: 'uuid-doador-1',
          createdAt: new Date('2026-05-20T10:00:00Z'),
          updatedAt: new Date('2026-05-20T10:00:00Z'),
          deletedAt: null,
        },
        {
          id: 'uuid-doacao-2',
          titulo: 'Cestas Básicas',
          quantidade: 5,
          status: DoacaoStatusEnum.PENDENTE,
          doadorId: 'uuid-doador-2',
          createdAt: new Date('2026-05-21T08:00:00Z'),
          updatedAt: new Date('2026-05-21T08:00:00Z'),
          deletedAt: null,
        },
      ];

      mockRepository.findAll.mockResolvedValue(doacoesMock);

      const result = await service.listarDoacoes();

      expect(result).toHaveLength(2);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar apenas os campos públicos do contrato: id, titulo, quantidade, status, doadorId', async () => {
      const doacaoMock: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Alimentos Não Perecíveis',
        quantidade: 20,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
        createdAt: new Date('2026-05-20T10:00:00Z'),
        updatedAt: new Date('2026-05-20T10:00:00Z'),
        deletedAt: null,
      };

      mockRepository.findAll.mockResolvedValue([doacaoMock]);

      const result = await service.listarDoacoes();

      expect(result[0]).toStrictEqual({
        id: 'uuid-doacao-1',
        titulo: 'Alimentos Não Perecíveis',
        quantidade: 20,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
      });

      // Garante que campos internos não vazam no contrato público
      expect(result[0]).not.toHaveProperty('createdAt');
      expect(result[0]).not.toHaveProperty('updatedAt');
      expect(result[0]).not.toHaveProperty('deletedAt');
    });

    it('Deve retornar o status correto de cada doação preservando o enum', async () => {
      const doacoesMock: DoacaoEntity[] = [
        {
          id: 'uuid-1',
          titulo: 'Brinquedos',
          quantidade: 15,
          status: DoacaoStatusEnum.RESERVADA,
          doadorId: 'uuid-doador-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'uuid-2',
          titulo: 'Calçados',
          quantidade: 8,
          status: DoacaoStatusEnum.ENTREGUE,
          doadorId: 'uuid-doador-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      mockRepository.findAll.mockResolvedValue(doacoesMock);

      const result = await service.listarDoacoes();

      expect(result[0].status).toBe(DoacaoStatusEnum.RESERVADA);
      expect(result[1].status).toBe(DoacaoStatusEnum.ENTREGUE);
    });

    it('Deve chamar o repositório uma única vez por requisição', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      await service.listarDoacoes();

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
