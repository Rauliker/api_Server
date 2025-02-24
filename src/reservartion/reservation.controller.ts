import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.createReservation(createReservationDto);
  }

  @Delete(':id')
  async cancelReservation(@Param('id') id: string) {
    return this.reservationService.cancelReservation(Number(id));
  }
}
