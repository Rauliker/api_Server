import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLocalidadDto {
  @ApiProperty({
    description: 'El nombre de la localidad',
    type: String,
    example: 'Localidad Ejemplo',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'El ID de la provincia a la que pertenece la localidad',
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  provinciaId: number;
}
