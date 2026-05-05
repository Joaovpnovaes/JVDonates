import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntregaEntity } from './entities/entrega.entity';
import { ENTREGAS_REPOSITORY } from './repositories/entregas.repository.interface';
import { EntregasService } from './services/entregas.service';
import { EntregasController } from './controllers/entregas.controller';
import { EntregasTypeORMRepository } from './repositories/entregas-type-orm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EntregaEntity])],
  controllers: [EntregasController],
  providers: [
    EntregasService,
    {
      provide: ENTREGAS_REPOSITORY,
      useClass: EntregasTypeORMRepository,
    },
  ],
  exports: [ENTREGAS_REPOSITORY, EntregasService],
})
export class DonationsModule {}
