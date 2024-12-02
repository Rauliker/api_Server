import { IsBoolean, IsDecimal, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  role: number;

  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @IsOptional()
  @IsDecimal()
  balance?: number;

  @IsNotEmpty()
  @IsNumber()
  provinciaId?: number;

  @IsNotEmpty()
  @IsNumber()
  localidadId?: number;
}


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' }) // Asegura que sea un decimal con hasta 2 decimales
  @Min(0) // Balance no puede ser negativo
  balance?: number;

  @IsOptional()
  @IsNumber()
  provinciaId?: number;

  @IsOptional()
  @IsNumber()
  localidadId?: number;
}