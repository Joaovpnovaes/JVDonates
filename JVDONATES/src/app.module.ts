import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './modules/payments/entities/payment.entity';
import { OrderEntity } from './modules/orders/entities/order.entity';
import { EntregaEntity } from './modules/donations/entities/entrega.entity';
import { DoacaoEntity } from './modules/doacoes/entities/doacao.entity';
import { UserEntity } from './modules/users/entities/user.entity';
import { OrdersModule } from './modules/orders/orders.module';
import { DonationsModule } from './modules/donations/donations.module';
import { DoacoesModule } from './modules/doacoes/doacoes.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrdersModule,
    DonationsModule,
    DoacoesModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST') ?? 'localhost';
        const port = Number(configService.get<string>('DB_PORT') ?? '5433');
        const username =
          configService.get<string>('DB_USERNAME') ??
          configService.get<string>('DB_USER');
        const password =
          configService.get<string>('DB_PASSWORD') ??
          configService.get<string>('POSTGRES_PASSWORD');
        const database =
          configService.get<string>('DB_DATABASE') ??
          configService.get<string>('DB_NAME') ??
          configService.get<string>('POSTGRES_DB');

        if (!username || !database) {
          throw new Error(
            'Database env vars missing. Define DB_USERNAME/DB_USER and DB_DATABASE/DB_NAME.',
          );
        }

        if (typeof password !== 'string') {
          throw new Error(
            'Database password is missing. Define DB_PASSWORD as a string in your environment.',
          );
        }

        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [OrderEntity, PaymentEntity, EntregaEntity, DoacaoEntity, UserEntity],
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
