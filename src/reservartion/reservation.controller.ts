import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reservationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateReservationDto: CreateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reservationService.remove(id);
  }
}
