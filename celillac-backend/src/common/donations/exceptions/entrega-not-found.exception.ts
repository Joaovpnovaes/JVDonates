import { NotFoundException } from '@nestjs/common';

export class EntregaNotFoundException extends NotFoundException {
  constructor(entregaId: string) {
    super(`Entrega with id "${entregaId}" not found.`);
  }
}
