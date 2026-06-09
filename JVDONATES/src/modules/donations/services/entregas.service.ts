import { Inject, Injectable } from '@nestjs/common';
import { ENTREGAS_REPOSITORY } from '../repositories/entregas.repository.interface';
import type { EntregasRepository } from '../repositories/entregas.repository.interface';
import { ConfirmarSaidaResponseDto } from '../dto/confirmar-saida-response.dto';
import { ConfirmarChegadaResponseDto } from '../dto/confirmar-chegada-response.dto';
import { EntregaNotFoundException } from 'src/common/donations/exceptions/entrega-not-found.exception';
import { EntregaAlreadyConfirmedException } from 'src/common/donations/exceptions/entrega-already-confirmed.exception';
import { EntregaStatusEnum } from 'src/common/donations/enums/entrega-status.enum';
import * as crypto from 'crypto';

@Injectable()
export class EntregasService {
  constructor(
    @Inject(ENTREGAS_REPOSITORY)
    private readonly entregasRepository: EntregasRepository,
  ) {}

  /**
   * RN06 (Confirmação Mútua) & RN02 (Imutabilidade)
   * Confirma a saída da doação pelo doador
   * Se ambas confirmações forem verdadeiras, gera hash_blockchain e muda status para 'confirmed'
   */
  async confirmarSaida(entregaId: string): Promise<ConfirmarSaidaResponseDto> {
    const entrega = await this.entregasRepository.findById(entregaId);

    if (!entrega) {
      throw new EntregaNotFoundException(entregaId);
    }

    // RN02: Validar imutabilidade - se já confirmado, impedir alteração
    if (entrega.status === EntregaStatusEnum.CONFIRMED) {
      throw new EntregaAlreadyConfirmedException(entregaId);
    }

    // Marcar confirmação do doador
    entrega.confirmacaoDoador = true;

    // RN06: Validar confirmação mútua - se ambas confirmações true, confirmar e gerar hash
    if (entrega.confirmacaoDoador && entrega.confirmacaoOng) {
      entrega.status = EntregaStatusEnum.CONFIRMED;
      entrega.hashBlockchain = this.generateBlockchainHash(entregaId);
    } else {
      // Se apenas uma confirmação, mudar para IN_TRANSIT
      entrega.status = EntregaStatusEnum.IN_TRANSIT;
    }

    entrega.updatedAt = new Date();
    const savedEntrega = await this.entregasRepository.save(entrega);

    return this.mapToResponseDto(savedEntrega);
  }

  /**
   * RN06 (Confirmação Mútua) & RN02 (Imutabilidade)
   * Confirma a chegada da doação pela ONG
   * Se ambas confirmações forem verdadeiras, gera hash_blockchain e muda status para 'confirmed'
   */
  async confirmarChegada(entregaId: string): Promise<ConfirmarChegadaResponseDto> {
    const entrega = await this.entregasRepository.findById(entregaId);

    if (!entrega) {
      throw new EntregaNotFoundException(entregaId);
    }

    // RN02: Validar imutabilidade - se já confirmado, impedir alteração
    if (entrega.status === EntregaStatusEnum.CONFIRMED) {
      throw new EntregaAlreadyConfirmedException(entregaId);
    }

    // Marcar confirmação da ONG
    entrega.confirmacaoOng = true;

    // RN06: Validar confirmação mútua - se ambas confirmações true, confirmar e gerar hash
    if (entrega.confirmacaoDoador && entrega.confirmacaoOng) {
      entrega.status = EntregaStatusEnum.CONFIRMED;
      entrega.hashBlockchain = this.generateBlockchainHash(entregaId);
    } else {
      // Se apenas uma confirmação, mudar para IN_TRANSIT
      entrega.status = EntregaStatusEnum.IN_TRANSIT;
    }

    entrega.updatedAt = new Date();
    const savedEntrega = await this.entregasRepository.save(entrega);

    return this.mapToResponseDto(savedEntrega);
  }

  /**
   * Gera um hash para a blockchain baseado no entregaId
   * Simula uma hash criptográfica robusta
   */
  private generateBlockchainHash(entregaId: string): string {
    const timestamp = new Date().getTime().toString();
    const data = `${entregaId}:${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private mapToResponseDto(entrega): ConfirmarChegadaResponseDto {
    return {
      entregaId: entrega.entregaId,
      confirmacaoDoador: entrega.confirmacaoDoador,
      confirmacaoOng: entrega.confirmacaoOng,
      status: entrega.status,
      hashBlockchain: entrega.hashBlockchain,
    };
  }
}
