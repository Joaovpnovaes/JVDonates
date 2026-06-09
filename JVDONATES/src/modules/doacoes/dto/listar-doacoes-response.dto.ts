import { DoacaoStatusEnum } from 'src/common/doacoes/enums/doacao-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ListarDoacoesResponseDto {
  @ApiProperty({
    example: '7c1b5d6b-0e61-4f2a-bd7d-3ecf91ec2d91',
    description: 'Identificador único da doação',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'Cestas básicas para famílias vulneráveis',
    description: 'Título da doação cadastrada',
    required: true,
  })
  titulo: string;

  @ApiProperty({
    example: 120,
    description: 'Quantidade total disponível para a doação',
    required: true,
  })
  quantidade: number;

  @ApiProperty({
    example: DoacaoStatusEnum.PENDENTE,
    description: 'Status atual da doação',
    required: true,
    enum: DoacaoStatusEnum,
  })
  status: DoacaoStatusEnum;

  @ApiProperty({
    example: 'f1d0a2c3-9b84-4f2d-8a1c-5c6b7a8d9e10',
    description: 'Identificador do doador responsável pela doação',
    required: true,
  })
  doadorId: string;
}
