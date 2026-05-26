import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoacaoEntity } from './entities/doacao.entity';
import { DOACOES_REPOSITORY } from './repositories/doacoes.repository.interface';
import { DoacoesTypeORMRepository } from './repositories/doacoes-type-orm.repository';
import { DoacoesService } from './services/doacoes.service';
import { DoacoesController } from './controllers/doacoes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DoacaoEntity])],
  controllers: [DoacoesController],
  providers: [
    DoacoesService,
    {
      provide: DOACOES_REPOSITORY,
      useClass: DoacoesTypeORMRepository,
    },
  ],
  exports: [DOACOES_REPOSITORY, DoacoesService],
})
export class DoacoesModule {}
