import { Injectable, Inject } from '@nestjs/common';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { CAMPAIGNS_REPOSITORY } from '../repositories/campaigns.repository.interface';
import { CampaignEntity } from '../entities/campaign.entity';
import { CampaignStatusEnum } from '../../../common/donations/enums/campaign-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CampaignsService {
  constructor(@Inject(CAMPAIGNS_REPOSITORY) private repository: any) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<CampaignEntity> {
    const campaign = {
      id: uuidv4(),
      title: createCampaignDto.title,
      description: createCampaignDto.description,
      targetAmount: createCampaignDto.targetAmount,
      currentAmount: 0,
      status: CampaignStatusEnum.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.repository.save(campaign);
  }
}
