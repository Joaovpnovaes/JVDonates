import { UserRoleEnum } from '../enums/user-role.enum';

export class CreateUserDto {
  email: string;

  password: string;

  role?: UserRoleEnum;
}