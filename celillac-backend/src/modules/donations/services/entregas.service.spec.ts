import { Test, TestingModule } from '@nestjs/testing';
import { EntregasService } from './entregas.service';
import { ENTREGAS_REPOSITORY } from '../repositories/entregas.repository.interface';
import { EntregaNotFoundException } from 'src/common/donations/exceptions/entrega-not-found.exception';
import { EntregaAlreadyConfirmedException } from 'src/common/donations/exceptions/entrega-already-confirmed.exception';
import { EntregaStatusEnum } from 'src/common/donations/enums/entrega-status.enum';
import { EntregaEntity } from '../entities/entrega.entity';

describe('EntregasService', () => {
  let service: EntregasService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntregasService,
        {
          provide: ENTREGAS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EntregasService>(EntregasService);
  });

  describe('confirmarSaida', () => {
    it('Deve lançar EntregaNotFoundException quando entrega não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.confirmarSaida('invalid-id')).rejects.toThrow(
        EntregaNotFoundException,
      );
    });

    it('Deve lançar EntregaAlreadyConfirmedException quando status é CONFIRMED (RN02)', async () => {
      const entrega: EntregaEntity = {
        entregaId: 'uuid-1',
        doacaoId: 'doacao-1',
        confirmacaoDoador: true,
        confirmacaoOng: true,
        status: EntregaStatusEnum.CONFIRMED,
        hashBlockchain: 'hash123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(entrega);

      await expect(service.confirmarSaida('uuid-1')).rejects.toThrow(
        EntregaAlreadyConfirmedException,
      );
    });

    it('Deve mudar status para IN_TRANSIT quando apenas doador confirma', async () => {
      const entrega: EntregaEntity = {
        entregaId: 'uuid-1',
        doacaoId: 'doacao-1',
        confirmacaoDoador: false,
        confirmacaoOng: false,
        status: EntregaStatusEnum.PENDING,
        hashBlockchain: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(entrega);
      mockRepository.save.mockResolvedValue({
        ...entrega,
        confirmacaoDoador: true,
        status: EntregaStatusEnum.IN_TRANSIT,
        updatedAt: new Date(),
      });

      const result = await service.confirmarSaida('uuid-1');

      expect(result.confirmacaoDoador).toBe(true);
      expect(result.status).toBe(EntregaStatusEnum.IN_TRANSIT);
      expect(result.hashBlockchain).toBeNull();
    });

    it('Deve mudar status para CONFIRMED e gerar hash quando ambas confirmações são true (RN06)', async () => {
      const entrega: EntregaEntity = {
        entregaId: 'uuid-1',
        doacaoId: 'doacao-1',
        confirmacaoDoador: false,
        confirmacaoOng: true, // ONG já confirmou
        status: EntregaStatusEnum.IN_TRANSIT,
        hashBlockchain: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const savedEntrega: EntregaEntity = {
        ...entrega,
        confirmacaoDoador: true,
        status: EntregaStatusEnum.CONFIRMED,
        hashBlockchain: 'abc123def456',
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(entrega);
      mockRepository.save.mockResolvedValue(savedEntrega);

      const result = await service.confirmarSaida('uuid-1');

      expect(result.confirmacaoDoador).toBe(true);
      expect(result.confirmacaoOng).toBe(true);
      expect(result.status).toBe(EntregaStatusEnum.CONFIRMED);
      expect(result.hashBlockchain).toBeTruthy();
    });
  });

  describe('confirmarChegada', () => {
    it('Deve lançar EntregaNotFoundException quando entrega não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.confirmarChegada('invalid-id')).rejects.toThrow(
        EntregaNotFoundException,
      );
    });

    it('Deve lançar EntregaAlreadyConfirmedException quando status é CONFIRMED (RN02)', async () => {
      const entrega: EntregaEntity = {
        entregaId: 'uuid-1',
        doacaoId: 'doacao-1',
        confirmacaoDoador: true,
        confirmacaoOng: true,
        status: EntregaStatusEnum.CONFIRMED,
        hashBlockchain: 'hash123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(entrega);

      await expect(service.confirmarChegada('uuid-1')).rejects.toThrow(
        EntregaAlreadyConfirmedException,
      );
    });

    it('Deve mudar status para IN_TRANSIT quando apenas ONG confirma', async () => {
      const entrega: EntregaEntity = {
        entregaId: 'uuid-1',
        doacaoId: 'doacao-1',
        confirmacaoDoador: false,
        confirmacaoOng: false,
        status: EntregaStatusEnum.PENDING,
        hashBlockchain: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockRepository.findById.mockResolvedValue(entrega);
      mockRepository.save.mockResolvedValue({
        ...entrega,
        confirmacaoOng: true,
        status: EntregaStatusEnum.IN_TRANSIT,
        updatedAt: new Date(),
      });

      const result = await service.confirmarChegada('uuid-1');

      expect(result.confirmacaoOng).toBe(true);
      expect(result.status).toBe(EntregaStatusEnum.IN_TRANSIT);
      expect(result.hashBlockchain).toBeNull();
    });

    it('Deve mudar status para CONFIRMED e gerar hash quando ambas confirmações são true (RN06)', async () => {
      const entrega: EntregaEntity = {
        entregaId: 'uuid-1',
        doacaoId: 'doacao-1',
        confirmacaoDoador: true, // Doador já confirmou
        confirmacaoOng: false,
        status: EntregaStatusEnum.IN_TRANSIT,
        hashBlockchain: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const savedEntrega: EntregaEntity = {
        ...entrega,
        confirmacaoOng: true,
        status: EntregaStatusEnum.CONFIRMED,
        hashBlockchain: 'def789ghi012',
        updatedAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(entrega);
      mockRepository.save.mockResolvedValue(savedEntrega);

      const result = await service.confirmarChegada('uuid-1');

      expect(result.confirmacaoDoador).toBe(true);
      expect(result.confirmacaoOng).toBe(true);
      expect(result.status).toBe(EntregaStatusEnum.CONFIRMED);
      expect(result.hashBlockchain).toBeTruthy();
    });
  });
});
