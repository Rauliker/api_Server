import { Transform } from 'class-transformer';
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
  avatar?: string;
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
  @Transform(({ value }) => parseInt(value, 10))
  provinciaId: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  localidadId: number;
  
  @IsNotEmpty()
  @IsString()
  calle: string;
}


export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
  
  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @IsOptional()
  @IsDecimal()
  @Min(0)
  balance?: number;

  @IsOptional()
  provinciaId?: number;

  @IsOptional()
  localidadId?: number;
  @IsOptional()
  @IsString()
  calle?: string;
}