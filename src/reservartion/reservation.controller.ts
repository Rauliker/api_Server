import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateReservationDto, UpdateReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService, private readonly jwtService: JwtService) {}


  @Get('/:email')
  async getReservations(@Param('email') email: string) {
    return this.reservationService.getReservationsByUserEmail(email);
  }

  @Post()
  async createReservation(@Request() req,@Body() createReservationDto: CreateReservationDto) {
    let decodedToken;
    try {
      const token = req.headers.authorization.split(' ')[1];
      decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }


    if (!decodedToken || !decodedToken.sub) {
      throw new BadRequestException('User ID not found in token');
    }
    const userId = decodedToken.sub;

    createReservationDto.userId = userId;


    return this.reservationService.createReservation(createReservationDto);
  }

  @Put(':id')
  async updateReservation(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.updateReservation(Number(id), updateReservationDto);
  }
  @Delete(':id')
  async cancelReservation(@Param('id') id: string) {
    return this.reservationService.cancelReservation(Number(id));
  }
}
