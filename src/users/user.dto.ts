export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  address: string;
  phoneNumber: string;
  image: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  phoneNumber?: string;
  image?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
