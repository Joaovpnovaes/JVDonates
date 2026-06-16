import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  resetToken: string | null

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null
}
