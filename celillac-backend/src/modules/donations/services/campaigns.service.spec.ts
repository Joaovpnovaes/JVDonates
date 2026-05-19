import { Test, TestingModule } from '@nestjs/testing';
import { CampaignsService } from './campaigns.service';
import { CAMPAIGNS_REPOSITORY } from '../repositories/campaigns.repository.interface';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { CampaignStatusEnum } from '../../../common/donations/enums/campaign-status.enum';

describe('CampaignsService', () => {
  let service: CampaignsService;
  let mockRepository;

  // Test data factory
  const createValidCampaignInput = (): CreateCampaignDto => ({
    title: 'Campanha de Caridade 2026',
    description: 'Uma campanha para arrecadar fundos destinados a pessoas necessitadas',
    targetAmount: 10000.0,
  });

  const createExpectedCampaignOutput = (input: CreateCampaignDto) => ({
    id: expect.any(String),
    title: input.title,
    description: input.description,
    targetAmount: input.targetAmount,
    currentAmount: 0,
    status: CampaignStatusEnum.ACTIVE,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

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
    it('should create an active donation campaign when valid data is provided', async () => {
      // Arrange
      const input = createValidCampaignInput();
      const expectedOutput = createExpectedCampaignOutput(input);

      mockRepository.save.mockResolvedValue(expectedOutput);

      // Act
      const result = await service.create(input);

      // Assert
      expect(result).toBeDefined();
      expect(result).toMatchObject({
        id: expect.any(String),
        title: input.title,
        description: input.description,
        targetAmount: input.targetAmount,
        currentAmount: 0,
        status: CampaignStatusEnum.ACTIVE,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          title: input.title,
          description: input.description,
          targetAmount: input.targetAmount,
          currentAmount: 0,
          status: CampaignStatusEnum.ACTIVE,
        }),
      );
    });
  });
});
