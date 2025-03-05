import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVenueDto {
  @IsString()
  @IsNotEmpty()
  venueName: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsInt()
  @IsNotEmpty()
  pricePerHour: number;

  @IsString()
  @IsNotEmpty()
  category: string; // You can define an enum for category if needed

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export class UpdateVenueDto {
  @IsString()
  @IsOptional()
  venueName?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsInt()
  @IsOptional()
  pricePerHour?: number;

  @IsString()
  @IsOptional()
  category?: string; // You can define an enum for category if needed

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  image?: string;
}
