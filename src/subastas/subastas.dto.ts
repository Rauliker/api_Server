import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePujaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @IsOptional()
  @IsBoolean()
  open?: boolean;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsDecimal()
  pujaInicial: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  fechaFin: Date;

  @IsNotEmpty()
  @IsString()
  creatorId: string; 
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes: string[]; 
}

export class MakeBidDto {
    @IsNotEmpty()
    @IsString()
    userId: string; // El ID del usuario que realiza la puja (email)
  
    @IsNotEmpty()
    @IsNumber()
    pujaId: number; // El ID de la puja

    @IsOptional()
    @IsString()
    iswinner: boolean;

    @IsNotEmpty()
    @IsDecimal()
    bidAmount: number; // Cantidad ofrecida en la puja

    @IsNotEmpty()
    @IsString()
    email_user: string;
  }

  export class UpdatePujaDto {
    @IsOptional()
    @IsString()
    nombre?: string;
    @IsOptional()
    @IsString()
    open?: boolean;
  
    @IsOptional()
    @IsString()
    descripcion?: string;
  
    @IsOptional()
    @IsDecimal()
    pujaInicial?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    eliminatedImages?: string[];
    
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imagenes: string[]; 

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    fechaFin?: Date;
  }
  