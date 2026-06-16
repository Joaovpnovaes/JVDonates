import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UserEntity } from './entities/user.entity'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service'
import { UserTypeORMRepository } from './repositories/user.typeorm.repository'
import { USER_REPOSITORY } from './repositories/user.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeORMRepository,
    },
  ],
  exports: [AuthService, USER_REPOSITORY],
})
export class UsersModule {}
