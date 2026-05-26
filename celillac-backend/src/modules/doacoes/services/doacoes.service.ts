import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOACOES_REPOSITORY } from '../repositories/doacoes.repository.interface';
import type { DoacoesRepository } from '../repositories/doacoes.repository.interface';
import { ListarDoacoesResponseDto } from '../dto/listar-doacoes-response.dto';
import { UpdateDoacaoDto } from '../dto/update-doacao.dto';

@Injectable()
export class DoacoesService {
  constructor(
    @Inject(DOACOES_REPOSITORY)
    private readonly doacoesRepository: DoacoesRepository,
  ) {}

  /**
   * UC10 - Consultar Inventário de Doações
   * Retorna todas as doações cadastradas no sistema.
   */
  async listarDoacoes(): Promise<ListarDoacoesResponseDto[]> {
    const doacoes = await this.doacoesRepository.findAll();
    return doacoes.map((doacao) => this.mapToResponseDto(doacao));
  }

  /**
   * Busca detalhada de uma doação por ID
   * @param id - ID da doação a ser consultada
   * @returns Dados completos da doação encontrada
   * @throws NotFoundException - Se a doação não for encontrada
   */
  async obterDoacaoPorId(id: string): Promise<ListarDoacoesResponseDto> {
    const doacao = await this.doacoesRepository.findById(id);
    
    if (!doacao) {
      throw new NotFoundException('Doação não encontrada.');
    }
    
    return this.mapToResponseDto(doacao);
  }

  /**
   * Atualização parcial de uma doação (PATCH)
   * Fluxo de validação:
   * 1. Busca o registro existente no banco
   * 2. Valida se existe (404 Not Found)
   * 3. Aplica alterações parciais usando Object.assign()
   * 4. Salva a entidade atualizada
   * 5. Retorna o registro atualizado
   * 
   * @param id - ID da doação a ser atualizada
   * @param updateDto - Dados para atualização (todos os campos são opcionais)
   * @returns Doação atualizada após persistência
   * @throws NotFoundException - Se a doação não for encontrada (HTTP 404)
   */
  async update(
    id: string,
    updateDto: UpdateDoacaoDto,
  ): Promise<ListarDoacoesResponseDto> {
    // 1. Buscar o registro existente no banco de dados
    const doacaoExistente = await this.doacoesRepository.findById(id);
    
    // 2. Validação: se não encontrar, lança NotFoundException (HTTP 404)
    if (!doacaoExistente) {
      throw new NotFoundException('Doação não encontrada.');
    }
    
    // 3. Aplicar as alterações parciais usando Object.assign()
    // Isso permite que apenas os campos fornecidos sejam atualizados
    Object.assign(doacaoExistente, updateDto);
    
    // 4. Salvar a entidade atualizada (preservando a identidade/ID)
    const doacaoAtualizada = await this.doacoesRepository.save(
      doacaoExistente,
    );
    
    // 5. Retornar o registro atualizado mapeado para DTO
    return this.mapToResponseDto(doacaoAtualizada);
  }

  private mapToResponseDto(doacao): ListarDoacoesResponseDto {
    return {
      id: doacao.id,
      titulo: doacao.titulo,
      quantidade: doacao.quantidade,
      status: doacao.status,
      doadorId: doacao.doadorId,
    };
  }
}
