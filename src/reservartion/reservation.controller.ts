import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateReservationDto, UpdateReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService, private readonly jwtService: JwtService) {}

  @Get('/:id')
  async getReservationId(@Param('id') id: number, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.reservationService.getReservationsById(id, token);
  }

  @Get('/actives/:email')
  async getReservations(@Param('email') email: string, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];

    return this.reservationService.getReservationsByUserEmail(email,token);
  }
  @Get('/historial/:email')
  async getReservationsHistorial(@Param('email') email: string, @Request() req) {
    
    const token = req.headers.authorization.split(' ')[1];

    return this.reservationService.getReservationsByUserEmailHistorial(email,token);
  }
  @Post('payment')
    async createPaymentIntent(@Request() req,@Body() body) {
    const token = req.headers.authorization.split(' ')[1];

    const {id, amount, currency } = body;
    return this.reservationService.createPaymentIntent(token, id, amount, currency);
  }

  @Post('confirm')
  async confirmPayment(@Body() body) {

    const {id } = body;
    return this.reservationService.confirmPayment(id);
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
  async updateReservation(@Param('id') id: number, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationService.updateReservation(id, updateReservationDto);
  }
  @Delete(':id')
  async cancelReservation(@Param('id') id: number, @Request() req) {
    const token = req.headers.authorization.split(' ')[1];
    return this.reservationService.cancelReservation(id,token);
  }
}
