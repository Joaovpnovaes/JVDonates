import { EntregaEntity } from '../entities/entrega.entity';

export const ENTREGAS_REPOSITORY = 'ENTREGAS_REPOSITORY';

export interface EntregasRepository {
  findById(entregaId: string): Promise<EntregaEntity | null>;
  save(entrega: EntregaEntity): Promise<EntregaEntity>;
}
