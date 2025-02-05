import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateProvinciaDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: "Valencia", type: String, description: "Nombre de la provincia" }) 
    nombre: string;
}
