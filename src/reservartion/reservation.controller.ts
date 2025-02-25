import { BadRequestException, Body, Controller, Delete, Param, Post, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService, private readonly jwtService: JwtService) {}


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

  @Delete(':id')
  async cancelReservation(@Param('id') id: string) {
    return this.reservationService.cancelReservation(Number(id));
  }
}
