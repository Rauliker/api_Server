export class CreateUserDto {
  name: string;
  email: string;
  username: string;
  phone: string;
  adrress: string;
  role?: string;
  password: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  adrress?: string;
  role?: string;
  password?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
