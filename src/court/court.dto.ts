import { IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCourtDto {
  name: string;
  typeId: number;
  @IsIn(['open', 'closed'], { message: 'El estado debe ser "open", "closed"' })
  @IsNotEmpty()
  status: string;
  price: number;
  
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
}


export class UpdateCourtDto {
  name?: string;
  typeId?: number;
  @IsIn(['open', 'closed'], { message: 'El estado debe ser "open", "closed"' })    
  @IsOptional()
  status: string;
  price?: number;

  availability?: {
    monday?: string[];
    tuesday?: string[];
    wednesday?: string[];
    thursday?: string[];
    friday?: string[];
    saturday?: string[];
    sunday?: string[];
  };
}
