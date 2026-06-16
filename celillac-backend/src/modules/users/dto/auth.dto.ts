export class LoginRequestDto {
  email: string
  password: string
}

export class RegisterRequestDto {
  name: string
  email: string
  password: string
}

export class ForgotPasswordRequestDto {
  email: string
}

export class ResetPasswordRequestDto {
  token: string
  password: string
}

export class UserResponseDto {
  id: string
  email: string
  name: string
}

export class AuthResponseDto {
  token: string
  user: UserResponseDto
}
