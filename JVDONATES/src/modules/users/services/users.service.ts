import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const password = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      ...dto,
      password,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.removePassword(savedUser);
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users.map((user) => this.removePassword(user));
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.removePassword(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const updatePayload = { ...dto };

    if (dto.password) {
      updatePayload.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(user, updatePayload);

    const updatedUser = await this.usersRepository.save(user);
    return this.removePassword(updatedUser);
  }

  private removePassword(user: UserEntity) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}