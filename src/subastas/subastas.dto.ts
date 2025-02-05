import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePujaDto {
  @ApiProperty({
    description: 'Nombre de la puja',
    example: 'Puja de arte',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Estado de la puja (abierta o cerrada)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  open?: boolean;

  @ApiProperty({
    description: 'Descripción de la puja',
    example: 'Puja de una pintura famosa',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({
    description: 'Puja inicial de la oferta',
    example: 100.00,
  })
  @IsNotEmpty()
  @IsDecimal()
  pujaInicial: number;

  @ApiProperty({
    description: 'Fecha de finalización de la puja',
    example: '2025-02-20T15:30:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fechaFin: Date;

  @ApiProperty({
    description: 'ID del creador de la puja (usuario)',
    example: 'user123@example.com',
  })
  @IsNotEmpty()
  @IsString()
  creatorId: string;

  @ApiProperty({ type: [String], description: 'Imágenes asociadas a la puja',
    example: [],
    required: false, })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes: string[];
}

export class MakeBidDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la puja',
    example: 'user123@example.com',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID de la puja',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  pujaId: number;

  @ApiProperty({
    description: 'Indica si el usuario ganó la puja',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsString()
  iswinner: boolean;

  @ApiProperty({
    description: 'Monto de la puja',
    example: 150.00,
  })
  @IsNotEmpty()
  @IsDecimal()
  bidAmount: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario que realiza la puja',
    example: 'user123@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email_user: string;

  @ApiProperty({
    description: 'Indica si la puja es automática',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  is_auto: boolean;

  @ApiProperty({
    description: 'Monto máximo de la puja automática',
    example: 200.00,
  })
  @IsNotEmpty()
  @IsNumber()
  max_auto_bid: number;

  @ApiProperty({
    description: 'Incremento de la puja',
    example: 10.00,
  })
  @IsNotEmpty()
  @IsNumber()
  increment: number;

  @ApiProperty({
    description: 'Fecha de la puja (opcional)',
    example: '2025-02-20T15:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fecha: Date;
}

export class UpdateBidDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la puja',
    example: 'user123@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'ID de la puja',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pujaId?: number;

  @ApiProperty({
    description: 'Indica si el usuario ganó la puja',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsString()
  iswinner?: boolean;

  @ApiProperty({
    description: 'Monto de la puja',
    example: 150.00,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  bidAmount?: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario que realiza la puja',
    example: 'user123@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  email_user?: string;

  @ApiProperty({
    description: 'Fecha de la puja (opcional)',
    example: '2025-02-20T15:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fecha?: Date;
}

export class UpdatePujaDto {
  @ApiProperty({
    description: 'Nombre de la puja (opcional)',
    example: 'Puja de arte renovada',
    required: false,
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({
    description: 'Estado de la puja (opcional)',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  open?: boolean;

  @ApiProperty({
    description: 'Descripción de la puja (opcional)',
    example: 'Puja de una pintura famosa renovada',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Puja inicial de la oferta (opcional)',
    example: 100.00,
    required: false,
  })
  @IsOptional()
  @IsDecimal()
  pujaInicial?: number;

  @ApiProperty({
    description: 'Imágenes eliminadas de la puja (opcional)',
    example: ['image1.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eliminatedImages?: string[];

  @ApiProperty({
    description: 'Imágenes relacionadas con la puja (opcional)',
    example: ['image3.jpg', 'image4.jpg'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes: string[];

  @ApiProperty({
    description: 'Fecha de finalización de la puja (opcional)',
    example: '2025-02-22T15:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fechaFin?: Date;
}
