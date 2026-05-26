import { DoacaoEntity } from '../entities/doacao.entity';

export const DOACOES_REPOSITORY = 'DOACOES_REPOSITORY';

export interface DoacoesRepository {
  findAll(): Promise<DoacaoEntity[]>;
}
