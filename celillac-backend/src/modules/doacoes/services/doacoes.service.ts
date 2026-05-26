import { Inject, Injectable } from '@nestjs/common';
import { DOACOES_REPOSITORY } from '../repositories/doacoes.repository.interface';
import type { DoacoesRepository } from '../repositories/doacoes.repository.interface';
import { ListarDoacoesResponseDto } from '../dto/listar-doacoes-response.dto';

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
