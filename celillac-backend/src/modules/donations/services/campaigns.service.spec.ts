import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { CAMPAIGNS_REPOSITORY } from '../repositories/campaigns.repository.interface';
import { CreateCampaignDto } from '../dto/create-campaign.dto';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: CAMPAIGNS_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  describe('create', () => {
    it('Deve criar uma nova campanha com dados válidos (RED)', async () => {
      // Arrange
      const createCampaignDto: CreateCampaignDto = {
        title: 'Campanha de Caridade 2026',
        description: 'Uma campanha para arrecadar fundos destinados a pessoas necessitadas',
        targetAmount: 10000.0,
      };

      const mockSaveResult = {
        id: expect.any(String), // Deve gerar um UUID
        title: createCampaignDto.title,
        description: createCampaignDto.description,
        targetAmount: createCampaignDto.targetAmount,
        currentAmount: 0,
        status: 'active',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      mockRepository.save.mockResolvedValue(mockSaveResult);

      // Act
      const result = await service.create(createCampaignDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.title).toBe(createCampaignDto.title);
      expect(result.description).toBe(createCampaignDto.description);
      expect(result.targetAmount).toBe(createCampaignDto.targetAmount);
      expect(result.currentAmount).toBe(0);
      expect(result.status).toBe('active');
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: createCampaignDto.title,
          description: createCampaignDto.description,
          targetAmount: createCampaignDto.targetAmount,
          currentAmount: 0,
          status: 'active',
        }),
      );
    });
  });
});
