import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLocalidadDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;
  
    @IsNotEmpty()
    @IsNumber()
    provinciaId: number;
  }