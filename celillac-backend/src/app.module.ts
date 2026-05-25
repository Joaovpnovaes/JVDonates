import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { OrderEntity } from './modules/orders/entities/order.entity';
import { EntregaEntity } from './modules/donations/entities/entrega.entity';
import { DoacaoEntity } from './modules/doacoes/entities/doacao.entity';
import { OrdersModule } from './modules/orders/orders.module';
import { DonationsModule } from './modules/donations/donations.module';
import { DoacoesModule } from './modules/doacoes/doacoes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrdersModule,
    DonationsModule,
    DoacoesModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [OrderEntity, PaymentEntity, EntregaEntity, DoacaoEntity],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
