
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class CreateReservationDto {
    @IsInt()
    userId: number;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsInt()
    @IsOptional()
    courtId?: number;

    @IsString()
    @IsOptional()
    endTime?: string;

    @IsInt()
    @IsOptional()
    statusId?: number;
}
