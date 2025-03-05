import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  venueId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @IsNotEmpty()
  beginTime: number;

  @IsInt()
  @IsNotEmpty()
  endTime: number;

  @IsInt({ each: true })
  @IsNotEmpty()
  hours: number[];

  @IsInt()
  @IsNotEmpty()
  bookingTime: number;

  @IsInt()
  @IsNotEmpty()
  totalPrice: number;
}

export class UpdateReservationDto {
  @IsString()
  @IsOptional()
  venueId?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsInt()
  @IsOptional()
  beginTime?: number;

  @IsInt()
  @IsOptional()
  endTime?: number;

  @IsInt({ each: true })
  @IsOptional()
  hours?: number[];

  @IsInt()
  @IsOptional()
  bookingTime?: number;

  @IsInt()
  @IsOptional()
  totalPrice?: number;
}
