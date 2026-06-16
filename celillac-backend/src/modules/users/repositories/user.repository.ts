import { UserEntity } from '../entities/user.entity'

export const USER_REPOSITORY = 'USER_REPOSITORY'

export interface UserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  create(user: Partial<UserEntity>): Promise<UserEntity>
  update(id: string, user: Partial<UserEntity>): Promise<UserEntity>
  delete(id: string): Promise<void>
}
