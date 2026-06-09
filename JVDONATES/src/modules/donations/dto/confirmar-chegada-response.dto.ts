import { EntregaStatusEnum } from 'src/common/donations/enums/entrega-status.enum';

export class ConfirmarChegadaResponseDto {
  entregaId: string;
  confirmacaoDoador: boolean;
  confirmacaoOng: boolean;
  status: EntregaStatusEnum;
  hashBlockchain: string | null;
}
