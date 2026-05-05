import { Controller, Param, Patch } from '@nestjs/common';
import { EntregasService } from '../services/entregas.service';
import { ConfirmarSaidaResponseDto } from '../dto/confirmar-saida-response.dto';
import { ConfirmarChegadaResponseDto } from '../dto/confirmar-chegada-response.dto';

@Controller('api/v1/entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Patch(':id/saida')
  async confirmarSaida(
    @Param('id') entregaId: string,
  ): Promise<ConfirmarSaidaResponseDto> {
    return this.entregasService.confirmarSaida(entregaId);
  }

  @Patch(':id/chegada')
  async confirmarChegada(
    @Param('id') entregaId: string,
  ): Promise<ConfirmarChegadaResponseDto> {
    return this.entregasService.confirmarChegada(entregaId);
  }
}
