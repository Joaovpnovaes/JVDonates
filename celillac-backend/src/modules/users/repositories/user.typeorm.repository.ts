import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '../entities/user.entity'
import { UserRepository } from './user.repository'

@Injectable()
export class UserTypeORMRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } })
  }

  async create(user: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = this.repository.create(user)
    return this.repository.save(newUser)
  }

  async update(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    await this.repository.update(id, user)
    const updated = await this.repository.findOne({ where: { id } })
    if (!updated) {
      throw new Error(`User with id ${id} not found`)
    }
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id)
  }
}
