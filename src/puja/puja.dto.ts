import { IsArray, IsDate, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePujaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDecimal()
  pujaInicial: number;

  @IsOptional()
  @IsDecimal()
  pujaActual: number;

  @IsNotEmpty()
  @IsDate()
  fechaFin: Date;

  @IsNotEmpty()
  @IsString()
  creatorId: string; // El ID del usuario que crea la puja (email)

  @IsArray()
  @IsString({ each: true })
  imagenes: string[]; // URLs de las imágenes
}

export class MakeBidDto {
    @IsNotEmpty()
    @IsString()
    userId: string; // El ID del usuario que realiza la puja (email)
  
    @IsNotEmpty()
    @IsNumber()
    pujaId: number; // El ID de la puja
  
    @IsNotEmpty()
    @IsDecimal()
    bidAmount: number; // Cantidad ofrecida en la puja
  }

  export class UpdatePujaDto {
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @IsOptional()
    @IsString()
    descripcion?: string;
  
    @IsOptional()
    @IsDecimal()
    pujaInicial?: number;

    @IsOptional()
    @IsDecimal()
    pujaActual?: number
  
    @IsOptional()
    @IsDate()
    fechaFin?: Date;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imagenes?: string[];
  }
  