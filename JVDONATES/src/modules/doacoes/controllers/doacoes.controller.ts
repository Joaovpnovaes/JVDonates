import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DoacoesService } from '../services/doacoes.service';
import { ListarDoacoesResponseDto } from '../dto/listar-doacoes-response.dto';
import { UpdateDoacaoDto } from '../dto/update-doacao.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Doações')
@Controller('api/v1/doacoes')
export class DoacoesController {
  constructor(private readonly doacoesService: DoacoesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos cadastrados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
    type: ListarDoacoesResponseDto,
    isArray: true,
  })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async atualizarDoacao(
    @Param('id') id: string,
    @Body() updateDto: UpdateDoacaoDto,
  ): Promise<ListarDoacoesResponseDto> {
    return this.doacoesService.update(id, updateDto);
  }

  /**
   * Operação DELETE do CRUD (Exclusão física)
   * Apenas intercepta a requisição e delega execução para o service
   * 
   * @param id - Identificador extraído diretamente da rota
   * @returns Confirmação de exclusão
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async removerDoacao(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.doacoesService.remove(id);
  }
}
