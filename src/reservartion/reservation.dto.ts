import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateReservationDto {
    @IsInt()
    @IsOptional()
    userId?: number;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "La fecha debe estar en formato YYYY-MM-DD" })
    @IsNotEmpty()
    date: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: "La hora debe estar en formato HH:MM" })
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: "La hora debe estar en formato HH:MM" })
    @IsNotEmpty()
    endTime: string;

    @IsInt()
    @IsNotEmpty()
    courtId: number;
    
    @IsIn(['created', 'confirmed', 'rejected'], { message: 'El estado debe ser "created", "confirmed" o "rejected"' })
    @IsNotEmpty()
    status: string;
}
