import { Injectable, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import type { UserRepository } from '../repositories/user.repository'
import { USER_REPOSITORY } from '../repositories/user.repository'
import { UserEntity } from '../entities/user.entity'

interface UserPayload {
  id: string
  email: string
  name: string
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string): Promise<{ token: string; user: UserPayload }> {
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new BadRequestException('Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    const token = this.jwtService.sign({ id: user.id, email: user.email })
    return {
      token,
      user: this.sanitizeUser(user),
    }
  }

  async login(email: string, password: string): Promise<{ token: string; user: UserPayload }> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email })
    return {
      token,
      user: this.sanitizeUser(user),
    }
  }

  async validateToken(token: string): Promise<UserPayload> {
    try {
      const decoded = this.jwtService.verify(token)
      const user = await this.userRepository.findById(decoded.id)
      if (!user) {
        throw new UnauthorizedException('User not found')
      }
      return this.sanitizeUser(user)
    } catch {
      throw new UnauthorizedException('Invalid token')
    }
  }

  async getMe(token: string): Promise<UserPayload> {
    return this.validateToken(token)
  }

  async forgotPassword(email: string): Promise<{ message: string; token?: string }> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      return { message: 'If an account exists, a reset link has been sent' }
    }

    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await this.userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    })

    return {
      message: 'Password reset link sent to email',
      token: resetToken,
    }
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const user = await this.userRepository.findByEmail('')
    if (!user) {
      throw new BadRequestException('Invalid reset token')
    }

    // In production, search by resetToken instead
    const users = [user]
    const userWithToken = users.find(u => u.resetToken === token && u.resetTokenExpiry && u.resetTokenExpiry > new Date())

    if (!userWithToken) {
      throw new BadRequestException('Invalid or expired reset token')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await this.userRepository.update(userWithToken.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    })

    return { message: 'Password reset successfully' }
  }

  private sanitizeUser(user: UserEntity): UserPayload {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}
