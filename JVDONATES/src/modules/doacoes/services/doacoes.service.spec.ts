import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
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
      findById: jest.fn(),
      save: jest.fn(),
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

  describe('obterDoacaoPorId - Busca Detalhada por ID', () => {
    it('Deve retornar a doação mapeada corretamente quando encontrada', async () => {
      const doacaoMock: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Roupas de Inverno',
        quantidade: 10,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
        createdAt: new Date('2026-05-20T10:00:00Z'),
        updatedAt: new Date('2026-05-20T10:00:00Z'),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(doacaoMock);

      const result = await service.obterDoacaoPorId('uuid-doacao-1');

      expect(result).toStrictEqual({
        id: 'uuid-doacao-1',
        titulo: 'Roupas de Inverno',
        quantidade: 10,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
      });
    });

    it('Deve chamar o repositório com o ID correto', async () => {
      const doacaoMock: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Alimentos',
        quantidade: 5,
        status: DoacaoStatusEnum.PENDENTE,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(doacaoMock);

      await service.obterDoacaoPorId('uuid-doacao-1');

      expect(mockRepository.findById).toHaveBeenCalledWith('uuid-doacao-1');
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar NotFoundException quando a doação não for encontrada', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.obterDoacaoPorId('uuid-doacao-inexistente'),
      ).rejects.toThrow(NotFoundException);
    });

    it('Deve lançar NotFoundException com mensagem clara quando doação não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.obterDoacaoPorId('uuid-invalido'),
      ).rejects.toThrow('Doação não encontrada.');
    });

    it('Deve retornar apenas os campos públicos do contrato, sem expor campos internos', async () => {
      const doacaoMock: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Cestas Básicas',
        quantidade: 20,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
        createdAt: new Date('2026-05-20T10:00:00Z'),
        updatedAt: new Date('2026-05-20T10:00:00Z'),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(doacaoMock);

      const result = await service.obterDoacaoPorId('uuid-doacao-1');

      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('deletedAt');
    });

    it('Deve preservar o status (enum) correto da doação', async () => {
      const doacaoMock: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Brinquedos',
        quantidade: 15,
        status: DoacaoStatusEnum.RESERVADA,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(doacaoMock);

      const result = await service.obterDoacaoPorId('uuid-doacao-1');

      expect(result.status).toBe(DoacaoStatusEnum.RESERVADA);
    });
  });

  describe('update - Atualização Parcial (PATCH)', () => {
    it('Deve retornar a doação atualizada quando encontrada', async () => {
      const doacaoExistente: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Roupas de Inverno',
        quantidade: 10,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
        createdAt: new Date('2026-05-20T10:00:00Z'),
        updatedAt: new Date('2026-05-20T10:00:00Z'),
        deletedAt: null,
      };

      const updateDto = {
        titulo: 'Roupas de Verão',
        quantidade: 15,
      };

      const doacaoAtualizada: DoacaoEntity = {
        ...doacaoExistente,
        titulo: 'Roupas de Verão',
        quantidade: 15,
        updatedAt: new Date('2026-05-26T12:00:00Z'),
      };

      mockRepository.findById.mockResolvedValue(doacaoExistente);
      mockRepository.save.mockResolvedValue(doacaoAtualizada);

      const result = await service.update('uuid-doacao-1', updateDto);

      expect(result).toStrictEqual({
        id: 'uuid-doacao-1',
        titulo: 'Roupas de Verão',
        quantidade: 15,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
      });
    });

    it('Deve buscar a doação existente antes de atualizar', async () => {
      const doacaoMock: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Alimentos',
        quantidade: 5,
        status: DoacaoStatusEnum.PENDENTE,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(doacaoMock);
      mockRepository.save.mockResolvedValue(doacaoMock);

      await service.update('uuid-doacao-1', { titulo: 'Novo Título' });

      expect(mockRepository.findById).toHaveBeenCalledWith('uuid-doacao-1');
      expect(mockRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar NotFoundException quando a doação não for encontrada (HTTP 404)', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('uuid-inexistente', { titulo: 'Novo Título' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('Deve lançar NotFoundException com mensagem clara quando doação não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('uuid-invalido', { quantidade: 20 }),
      ).rejects.toThrow('Doação não encontrada.');
    });

    it('Deve aplicar apenas os campos fornecidos (atualização parcial)', async () => {
      const doacaoExistente: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Roupas',
        quantidade: 10,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updateDto = {
        titulo: 'Roupas de Inverno',
        // quantidade e status NÃO são fornecidos
      };

      mockRepository.findById.mockResolvedValue(doacaoExistente);
      mockRepository.save.mockImplementation((doacao) => {
        return Promise.resolve(doacao);
      });

      await service.update('uuid-doacao-1', updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-doacao-1',
          titulo: 'Roupas de Inverno',
          quantidade: 10, // Campo não atualizado
          status: DoacaoStatusEnum.DISPONIVEL, // Campo não atualizado
          doadorId: 'uuid-doador-1',
        }),
      );
    });

    it('Deve preservar a identidade (ID) da doação após atualização', async () => {
      const doacaoExistente: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Alimentos',
        quantidade: 5,
        status: DoacaoStatusEnum.PENDENTE,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updateDto = {
        titulo: 'Alimentos Frescos',
      };

      const doacaoAtualizada: DoacaoEntity = {
        ...doacaoExistente,
        titulo: 'Alimentos Frescos',
      };

      mockRepository.findById.mockResolvedValue(doacaoExistente);
      mockRepository.save.mockResolvedValue(doacaoAtualizada);

      const result = await service.update('uuid-doacao-1', updateDto);

      expect(result.id).toBe('uuid-doacao-1');
    });

    it('Deve chamar save() com a entidade modificada', async () => {
      const doacaoExistente: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Original',
        quantidade: 10,
        status: DoacaoStatusEnum.PENDENTE,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updateDto = {
        titulo: 'Atualizado',
        status: DoacaoStatusEnum.DISPONIVEL,
      };

      mockRepository.findById.mockResolvedValue(doacaoExistente);
      mockRepository.save.mockResolvedValue({
        ...doacaoExistente,
        ...updateDto,
      });

      await service.update('uuid-doacao-1', updateDto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uuid-doacao-1',
          titulo: 'Atualizado',
          status: DoacaoStatusEnum.DISPONIVEL,
        }),
      );
    });

    it('Deve retornar apenas os campos públicos após atualização', async () => {
      const doacaoExistente: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Alimentos',
        quantidade: 5,
        status: DoacaoStatusEnum.PENDENTE,
        doadorId: 'uuid-doador-1',
        createdAt: new Date('2026-05-20T10:00:00Z'),
        updatedAt: new Date('2026-05-20T10:00:00Z'),
        deletedAt: null,
      };

      const doacaoAtualizada: DoacaoEntity = {
        ...doacaoExistente,
        titulo: 'Alimentos Frescos',
        updatedAt: new Date('2026-05-26T12:00:00Z'),
      };

      mockRepository.findById.mockResolvedValue(doacaoExistente);
      mockRepository.save.mockResolvedValue(doacaoAtualizada);

      const result = await service.update('uuid-doacao-1', {
        titulo: 'Alimentos Frescos',
      });

      expect(result).not.toHaveProperty('createdAt');
      expect(result).not.toHaveProperty('updatedAt');
      expect(result).not.toHaveProperty('deletedAt');
    });

    it('Deve atualizar múltiplos campos quando fornecidos', async () => {
      const doacaoExistente: DoacaoEntity = {
        id: 'uuid-doacao-1',
        titulo: 'Roupas',
        quantidade: 10,
        status: DoacaoStatusEnum.PENDENTE,
        doadorId: 'uuid-doador-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const updateDto = {
        titulo: 'Roupas Novas',
        quantidade: 20,
        status: DoacaoStatusEnum.DISPONIVEL,
        doadorId: 'uuid-novo-doador',
      };

      const doacaoAtualizada: DoacaoEntity = {
        ...doacaoExistente,
        ...updateDto,
      };

      mockRepository.findById.mockResolvedValue(doacaoExistente);
      mockRepository.save.mockResolvedValue(doacaoAtualizada);

      const result = await service.update('uuid-doacao-1', updateDto);

      expect(result.titulo).toBe('Roupas Novas');
      expect(result.quantidade).toBe(20);
      expect(result.status).toBe(DoacaoStatusEnum.DISPONIVEL);
      expect(result.doadorId).toBe('uuid-novo-doador');
    });
  });
});
