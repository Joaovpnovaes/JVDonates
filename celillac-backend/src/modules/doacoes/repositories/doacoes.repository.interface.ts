import { DoacaoEntity } from '../entities/doacao.entity';

export const DOACOES_REPOSITORY = 'DOACOES_REPOSITORY';

export interface DoacoesRepository {
  findAll(): Promise<DoacaoEntity[]>;
  findById(id: string): Promise<DoacaoEntity | null>;
  save(doacao: DoacaoEntity): Promise<DoacaoEntity>;
  remove(doacao: DoacaoEntity): Promise<DoacaoEntity>;
}
