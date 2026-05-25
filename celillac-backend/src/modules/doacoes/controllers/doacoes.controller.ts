import { Controller, Get } from '@nestjs/common';
import { DoacoesService } from '../services/doacoes.service';
import { ListarDoacoesResponseDto } from '../dto/listar-doacoes-response.dto';

@Controller('api/v1/doacoes')
export class DoacoesController {
  constructor(private readonly doacoesService: DoacoesService) {}

  @Get()
  async listarDoacoes(): Promise<ListarDoacoesResponseDto[]> {
    return this.doacoesService.listarDoacoes();
  }
}
