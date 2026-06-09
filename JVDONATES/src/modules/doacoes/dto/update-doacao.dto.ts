import { DoacaoStatusEnum } from 'src/common/doacoes/enums/doacao-status.enum';

/**
 * DTO para atualização parcial de uma doação
 * Todos os campos são opcionais para permitir atualizações parciais (PATCH)
 * Campos restritos (id, createdAt, updatedAt) não estão inclusos por segurança
 */
export class UpdateDoacaoDto {
  /**
   * Título da doação
   * Opcional - apenas atualizado se fornecido
   */
  titulo?: string;

  /**
   * Quantidade de itens
   * Opcional - apenas atualizado se fornecido
   */
  quantidade?: number;

  /**
   * Status da doação (pendente, disponível, doado, etc)
   * Opcional - apenas atualizado se fornecido
   */
  status?: DoacaoStatusEnum;

  /**
   * ID do doador
   * Opcional - apenas atualizado se fornecido
   */
  doadorId?: string;
}
