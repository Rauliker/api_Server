
import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
    @IsInt()
    userId: number;

    @IsInt()
    courtId: number;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    startTime: string;

    @IsString()
    @IsNotEmpty()
    endTime: string;

    @IsInt()
    statusId: number;
}

export class UpdateReservationDto {

    @IsInt()
    @IsOptional()
    userId?: number;

    @IsInt()
    @IsOptional()
    courtId?: number;

    @IsDate()
    @IsOptional()
    date?: Date;

    @IsString()
    @IsOptional()
    startTime?: string;

    @IsString()
    @IsOptional()
    endTime?: string;

    @IsInt()
    @IsOptional()
    statusId?: number;
}
