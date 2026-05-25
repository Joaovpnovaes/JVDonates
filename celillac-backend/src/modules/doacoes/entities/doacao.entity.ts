import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { DoacaoStatusEnum } from 'src/common/doacoes/enums/doacao-status.enum';

@Entity('doacoes')
export class DoacaoEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'doacao_id' })
  id: string;

  @Column({ name: 'titulo' })
  titulo: string;

  @Column({ name: 'quantidade', type: 'int' })
  quantidade: number;

  @Column({
    type: 'enum',
    enum: DoacaoStatusEnum,
    default: DoacaoStatusEnum.PENDENTE,
  })
  status: DoacaoStatusEnum;

  @Column({ name: 'doador_id' })
  doadorId: string;

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
