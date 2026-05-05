import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { EntregaStatusEnum } from 'src/common/donations/enums/entrega-status.enum';

@Entity('entregas')
export class EntregaEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'entrega_id' })
  entregaId: string;

  @Column({ name: 'doacao_id' })
  doacaoId: string;

  @Column({ name: 'confirmacao_doador', default: false })
  confirmacaoDoador: boolean;

  @Column({ name: 'confirmacao_ong', default: false })
  confirmacaoOng: boolean;

  @Column({
    type: 'enum',
    enum: EntregaStatusEnum,
    default: EntregaStatusEnum.PENDING,
  })
  status: EntregaStatusEnum;

  @Column({ name: 'hash_blockchain', nullable: true })
  hashBlockchain: string | null;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
