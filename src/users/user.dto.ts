import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'usuario123',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;
  @ApiProperty({
    description: 'Rol del usuario (opcional)',
    example: "2",
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const role = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(role) ? 2 : role;  
  })
  @IsNumber()
  role: number;

  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @IsOptional()
  @IsNumber()
  balance?: number;

  @ApiProperty({
    description: 'ID de la provincia asociada al usuario',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  provinciaId: number;

  @ApiProperty({
    description: 'ID de la localidad asociada al usuario',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  localidadId: number;

  @ApiProperty({
    description: 'Dirección de la calle del usuario',
    example: 'Calle Falsa 123',
  })
  @IsNotEmpty()
  @IsString()
  calle: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Nombre de usuario (opcional)',
    example: 'nuevo_usuario123',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Contraseña del usuario (opcional)',
    example: 'nueva_contraseña',
    required: false,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Avatar del usuario (opcional)',
    example: 'https://example.com/nuevo_avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @Transform(({ value }) => {
    const role = typeof value === 'string' ? parseInt(value, 10) : value;
    return isNaN(role) ? 2 : role;  
  })
  @IsNumber()
  role: number;

  @ApiProperty({
    description: 'Estado de baneo del usuario (opcional)',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  banned?: boolean;

  @ApiProperty({
    description: 'Saldo del usuario (opcional)',
    example: 200,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @ApiProperty({
    description: 'ID de la provincia asociada al usuario (opcional)',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  provinciaId?: number;

  @ApiProperty({
    description: 'ID de la localidad asociada al usuario (opcional)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  localidadId?: number;

  @ApiProperty({
    description: 'Dirección de la calle del usuario (opcional)',
    example: 'Calle Nueva 456',
    required: false,
  })
  @IsOptional()
  @IsString()
  calle?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com', // valor por defecto que se muestra en Swagger
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'yourpassword', 
  })
  password: string;

  @ApiProperty({
    description: 'Device information',
    example: 'DeviceInfoExample',
  })
  deviceInfo: string;

  @ApiProperty({
    description: 'FCM Token for push notifications',
    example: 'FCMTokenExample',
    required: false, 
  })
  fcmToken?: string;
}
