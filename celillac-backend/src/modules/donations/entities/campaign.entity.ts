import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CampaignStatusEnum } from 'src/common/donations/enums/campaign-status.enum';

@Entity('campaigns')
export class CampaignEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'campaign_id' })
  id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'target_amount', type: 'decimal', precision: 10, scale: 2 })
  targetAmount: number;

  @Column({ name: 'current_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @Column({
    type: 'enum',
    enum: CampaignStatusEnum,
    default: CampaignStatusEnum.ACTIVE,
  })
  status: CampaignStatusEnum;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
