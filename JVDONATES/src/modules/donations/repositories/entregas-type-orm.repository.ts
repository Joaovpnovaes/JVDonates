import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntregaEntity } from '../entities/entrega.entity';
import { EntregasRepository } from './entregas.repository.interface';

@Injectable()
export class EntregasTypeORMRepository implements EntregasRepository {
  constructor(
    @InjectRepository(EntregaEntity)
    private readonly repository: Repository<EntregaEntity>,
  ) {}

  async findById(entregaId: string): Promise<EntregaEntity | null> {
    return this.repository.findOne({
      where: { entregaId },
    });
  }

  async save(entrega: EntregaEntity): Promise<EntregaEntity> {
    return this.repository.save(entrega);
  }
}
