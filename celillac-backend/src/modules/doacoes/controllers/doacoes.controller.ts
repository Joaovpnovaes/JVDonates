import { Controller, Get, Param, Patch, Body } from '@nestjs/common';
import { DoacoesService } from '../services/doacoes.service';
import { ListarDoacoesResponseDto } from '../dto/listar-doacoes-response.dto';
import { UpdateDoacaoDto } from '../dto/update-doacao.dto';

@Controller('api/v1/doacoes')
export class DoacoesController {
  constructor(private readonly doacoesService: DoacoesService) {}

  @Get()
  async listarDoacoes(): Promise<ListarDoacoesResponseDto[]> {
    return this.doacoesService.listarDoacoes();
  }

  /**
   * Busca detalhada de uma doação por ID
   * @param id - ID da doação parametrizado na rota
   * @returns Dados completos da doação ou 404 se não encontrada
   */
  @Get(':id')
  async obterDoacaoPorId(
    @Param('id') id: string,
  ): Promise<ListarDoacoesResponseDto> {
    return this.doacoesService.obterDoacaoPorId(id);
  }

  /**
   * Atualização parcial de uma doação (PATCH)
   * @param id - ID da doação parametrizado na rota
   * @param updateDto - Dados para atualização (todos os campos são opcionais)
   * @returns Doação atualizada ou 404 se não encontrada
   */
  @Patch(':id')
  async atualizarDoacao(
    @Param('id') id: string,
    @Body() updateDto: UpdateDoacaoDto,
  ): Promise<ListarDoacoesResponseDto> {
    return this.doacoesService.update(id, updateDto);
  }
}
