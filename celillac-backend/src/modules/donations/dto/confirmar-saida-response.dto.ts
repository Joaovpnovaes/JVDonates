import { EntregaStatusEnum } from 'src/common/donations/enums/entrega-status.enum';

export class ConfirmarSaidaResponseDto {
  entregaId: string;
  confirmacaoDoador: boolean;
  confirmacaoOng: boolean;
  status: EntregaStatusEnum;
  hashBlockchain: string | null;
}
