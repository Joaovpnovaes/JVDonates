import { UserRoleEnum } from '../enums/user-role.enum';

export class UpdateUserDto {
  email?: string;

  password?: string;

  role?: UserRoleEnum;
}