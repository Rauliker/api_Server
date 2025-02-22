
export class CreateReservationDto {
    userId: number;
    courtId: number;
    date: Date;
    startTime: string;
    endTime: string;
    statusId: number;
}
  
export class UpdateReservationDto {
    userId?: number;
    courtId?: number;
    date?: Date;
    startTime?: string;
    endTime?: string;
    statusId?: number;
}