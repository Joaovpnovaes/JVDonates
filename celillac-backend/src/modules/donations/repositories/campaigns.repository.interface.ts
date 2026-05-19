export const CAMPAIGNS_REPOSITORY = 'CAMPAIGNS_REPOSITORY';

export interface CampaignsRepository {
  save(campaign: any): Promise<any>;
}
