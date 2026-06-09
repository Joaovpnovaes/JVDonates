import { ConflictException } from '@nestjs/common';

export class EntregaAlreadyConfirmedException extends ConflictException {
  constructor(entregaId: string) {
    super(`Entrega with id "${entregaId}" is already confirmed. (RN02 - Immutability constraint)`);
  }
}
