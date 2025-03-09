export class CreateUserDto {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  password?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
