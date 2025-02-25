export class CreateCourtDto {
  name: string;
  typeId: number;
  statusId: number;
  
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
  statusId?: number;

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
