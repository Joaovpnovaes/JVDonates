import { Controller, Post, Get, Body, Headers, BadRequestException } from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import {
  LoginRequestDto,
  RegisterRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  AuthResponseDto,
  UserResponseDto,
} from '../dto/auth.dto'

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password)
  }

  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto.name, registerDto.email, registerDto.password)
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email)
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordRequestDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password)
  }

  @Get('me')
  async getMe(@Headers('authorization') authHeader: string): Promise<UserResponseDto> {
    if (!authHeader) {
      throw new BadRequestException('Authorization header missing')
    }

    const token = authHeader.replace('Bearer ', '')
    if (!token) {
      throw new BadRequestException('Invalid authorization header')
    }

    return this.authService.getMe(token)
  }
}
