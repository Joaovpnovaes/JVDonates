import { DoacaoStatusEnum } from 'src/common/doacoes/enums/doacao-status.enum';

export class ListarDoacoesResponseDto {
  id: string;
  titulo: string;
  quantidade: number;
  status: DoacaoStatusEnum;
  doadorId: string;
}
