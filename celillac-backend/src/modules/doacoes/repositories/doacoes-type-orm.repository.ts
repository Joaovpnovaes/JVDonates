import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoacaoEntity } from '../entities/doacao.entity';
import { DoacoesRepository } from './doacoes.repository.interface';

@Injectable()
export class DoacoesTypeORMRepository implements DoacoesRepository {
  constructor(
    @InjectRepository(DoacaoEntity)
    private readonly repository: Repository<DoacaoEntity>,
  ) {}

  async findAll(): Promise<DoacaoEntity[]> {
    return this.repository.find();
  }
}
