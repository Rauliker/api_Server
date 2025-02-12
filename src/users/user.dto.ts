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

  @IsOptional()
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

  @ApiProperty({
    description: 'Añadir Imagenes',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @ApiProperty({ description: 'Añadir imágenes', type: 'string', format: 'binary', required: false })
  @IsOptional()
  files?: any; 
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

  banned?: boolean;

  @ApiProperty({
    description: 'Saldo del usuario (opcional)',
    example: 200,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === null || value === '' ? undefined : Number(value)))
  @IsNumber()
  @Min(0)
  balance?: number;

  

  @IsOptional()
  @Transform(({ value }) => (value === null || value === '' ? undefined : Number(value)))
  @IsNumber()
  provinciaId?: number;

  @ApiProperty({
    description: 'ID de la localidad asociada al usuario (opcional)',
    example: 3,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === null || value === '' ? undefined : Number(value)))
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

  @ApiProperty({
      description: 'Añadir Imagenes',
      items: { type: 'string', format: 'binary' },
      required: false,
    })
  @ApiProperty({ description: 'Añadir imágenes', type: 'string', format: 'binary', required: false })
  @IsOptional()
  files?: any; 
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
