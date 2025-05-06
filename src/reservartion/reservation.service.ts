import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { In, LessThanOrEqual, Not, Repository } from 'typeorm';
import { Court } from '../court/court.entity';
import { User } from '../users/users.entity';
import { CreateReservationDto } from './reservation.dto';
import { Reservation, ReservationStatusEnum } from './reservation.entity';

@Injectable()
export class ReservationService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    private readonly jwtService: JwtService,
  ) {this.stripe = new Stripe(process.env.SECRET_KEY_STRIPE, { apiVersion: '2025-03-31.basil' });}

  private readonly logger = new Logger(ReservationService.name);

  // Función para obtener el nombre del día de la semana
  private getDayName(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  async confirmPayment(id: number) {
    this.reservationRepository.update(id, {status: ReservationStatusEnum.CONFIRMED});

    return { clientSecret: "bien" };
  }

  async createPaymentIntent(token:string,id:number, amount: number, currency: string) {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const user = await this.userRepository.findOne({ where: {id: userId } });
    if (!id) {
      throw new BadRequestException('Id de reserva no proporcionado');
    }
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }
    if (reservation.status !== ReservationStatusEnum.CREATED) {
      throw new BadRequestException('La reserva no se pude pagar');
    }
    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor que cero');
    }
    if (!currency) {
      throw new BadRequestException('Moneda no proporcionada');
    }
    if (currency !== 'usd' && currency !== 'eur') {
      throw new BadRequestException('Moneda no válida. Solo se permiten "usd" y "eur"');
    }
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount, // En centavos (ej: 1000 = $10.00)
      currency,
      confirmation_method: 'automatic',
      payment_method_types: ['card'],
      metadata: {
        reservationId: id.toString(),
        username: user.username,
      },
    });
    if (!paymentIntent) {
        throw new Error('Error creating payment intent');
    }

    return { clientSecret: paymentIntent.client_secret };
  }

  // Función para traducir el nombre del día de la semana
  private translateDayName(dayName: string): string {
    const translations: { [key: string]: string } = {
      sunday: 'domingo',
      monday: 'lunes',
      tuesday: 'martes',
      wednesday: 'miércoles',
      thursday: 'jueves',
      friday: 'viernes',
      saturday: 'sábado',
    };
    return translations[dayName] || dayName;
  }

  // Función para comprobar si la hora solicitada está dentro del horario de disponibilidad
  private isTimeAvailable(availability: string[], startTime: string, endTime: string): boolean {
    for (const range of availability) {
      const [rangeStart, rangeEnd] = range.split('-');
      if (startTime >= rangeStart && endTime <= rangeEnd) {
        return true;
      }
    }
    return false;
  }

  // Función para comprobar si dos rangos de tiempo se solapan
  private isTimeOverlap(
    existingStartTime: string,
    existingEndTime: string,
    newStartTime: string,
    newEndTime: string
  ): boolean {
    // Convierte el tiempo a minutos totales
    const timeToMinutes = (time: string): number => {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 60 + (minutes || 0) + (seconds || 0) / 60;
    };
  
    const existingStart = timeToMinutes(existingStartTime);
    const existingEnd = timeToMinutes(existingEndTime);
    const newStart = timeToMinutes(newStartTime);
    const newEnd = timeToMinutes(newEndTime);
  
    return !(
      newEnd <= existingStart ||
      newStart >= existingEnd 
    );
  }
  
  async getReservationsByUserEmail(email: string, token: string) {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    
    const user = await this.reservationRepository.find({ 
      where: { 
        user: { id: userId, email }, 
        status: In([ReservationStatusEnum.CREATED, ReservationStatusEnum.CONFIRMED]) 
      }, 
      relations: ['user', 'court'] 
    });
    if(user){
      return user;
    }else{
      throw new NotFoundException('Reservation not found');
    }
  }
  async getReservationsByUserEmailHistorial(email: string, token: string) {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;

    const user = await this.reservationRepository.find({ where: { user:{id:userId, email},status:Not(In([ReservationStatusEnum.CREATED, ReservationStatusEnum.CONFIRMED])) }, relations: ['user', 'court'] });
    if(user){
      return user;
    }else{
      throw new NotFoundException('Reservation not found');
    }
  }

  async getReservationsById(reservationId: number, token: string) {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const user = await this.reservationRepository.findOne({ where: { id:reservationId}, relations: ['user', 'court'] });
    if(user){
      if (user.user.id === userId) {
        return user;
      }
    }else{
      throw new NotFoundException('Reservation not found');
    }
    
  }


  async createReservation(createReservationDto: CreateReservationDto) {
    const { userId, courtId, date, startTime, endTime, status } = createReservationDto;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      throw new BadRequestException('Formato de fecha no válido');
    }

    if (reservationDate < today) {
      throw new BadRequestException('No se puede actualizar la reserva a una fecha pasada');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const court = await this.courtRepository.findOneBy({ id: courtId });
    if (!court) {
      throw new NotFoundException('Pista no enciontrada');
    }

    // Obtener el nombre del día de la semana
    const dayName = this.getDayName(reservationDate);
    // Verificar si la pista está disponible en el día y hora seleccionados
    const availability = court.availability[dayName];
    if (!availability) {
      throw new BadRequestException(`La pista no está disponible el ${this.translateDayName(dayName)}`);
    }

    if (!this.isTimeAvailable(availability, startTime, endTime)) {
      throw new BadRequestException(`La pista no está disponible a la hora seleccionada el ${this.translateDayName(dayName)}`);
    }

    const existingReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.courtId = :courtId', { courtId })
      .andWhere('reservation.date = :date', { date: date })
      .andWhere('reservation.status IN (:...statuses)', { statuses: [ReservationStatusEnum.CREATED, ReservationStatusEnum.CONFIRMED] })
      .getMany();

    for (const reservation of existingReservations) {

      if (this.isTimeOverlap(reservation.startTime, reservation.endTime, startTime, endTime) ) {
        
        throw new BadRequestException('Ya existe una reserva un esa franja');
        
      }
    }

    const reservation = this.reservationRepository.create({
      user,
      court,
      date: reservationDate,
      startTime,
      endTime,
    });

    return this.reservationRepository.save(reservation);
  }
  async updateReservation(reservationId: number, updateReservationDto: CreateReservationDto) {
    const { userId, courtId, date, startTime, endTime, status } = updateReservationDto;

    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      throw new BadRequestException('Formato de fecha no válido');
    }

    if (reservationDate < today) {
      throw new BadRequestException('No se puede actualizar la reserva a una fecha pasada');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const court = await this.courtRepository.findOneBy({ id: courtId });
    if (!court) {
      throw new NotFoundException('Pista no enciontrada');
    }

    const dayName = this.getDayName(reservationDate);

    const availability = court.availability[dayName];
    if (!availability) {
      throw new BadRequestException(`La pista no está disponible el ${dayName}`);
    }

    if (!this.isTimeAvailable(availability, startTime, endTime)) {
      throw new BadRequestException(`La pista no está disponible a la hora seleccionada el ${dayName}`);
    }

    const existingReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.courtId = :courtId', { courtId })
      .andWhere('reservation.date = :date', { date: date })
      .andWhere('reservation.id != :reservationId', { reservationId })
      .andWhere('reservation.status IN (:...statuses)', { statuses: [ReservationStatusEnum.CREATED, ReservationStatusEnum.CONFIRMED] })
      .getMany();

    for (const existingReservation of existingReservations) {

      if (this.isTimeOverlap(existingReservation.startTime, existingReservation.endTime, startTime, endTime)) {

        throw new BadRequestException('Ya existe una reserva un esa franja');
      }
    }


    reservation.user = user;
    reservation.court = court;
    reservation.date = reservationDate;
    reservation.startTime = startTime;
    reservation.endTime = endTime;

    return this.reservationRepository.save(reservation);
  }
  async cancelReservation(reservationId: number, token: string) {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId, user:{id:userId} },
    });

    if (!reservation) {
      throw new NotFoundException('Redervs no encontrada');
    }
      if ([ReservationStatusEnum.FINISHED, ReservationStatusEnum.REJECTED].includes(reservation.status)) {
        throw new BadRequestException('No se puede cancelar una reserva finalizada o rechazada');
      }
  
      reservation.status = ReservationStatusEnum.REJECTED;
  
      return this.reservationRepository.save(reservation);
    

    
  }
  @Cron("* 1 * * * *")
  async handleCron() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); 
    const reservations = await this.reservationRepository.find({
      where: {
      status: In([ReservationStatusEnum.CREATED, ReservationStatusEnum.CONFIRMED]),
      date: LessThanOrEqual(new Date(currentDate)),
      endTime: LessThanOrEqual(currentTime),
      },
    });

    for (const reservation of reservations) {

      reservation.status = ReservationStatusEnum.FINISHED;
      await this.reservationRepository.save(reservation);
    }
    
  }
  @Cron("* 10 * * * *")
  async handleFiveMinuteCron() {

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const unpaidReservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatusEnum.CREATED,
        createdAt: LessThanOrEqual(tenMinutesAgo),
      },
    });

    for (const reservation of unpaidReservations) {
      reservation.status = ReservationStatusEnum.REJECTED;
      await this.reservationRepository.save(reservation);
      this.logger.log(`Reservation with ID ${reservation.id} has been automatically canceled due to non-payment`);
    }
  }
}
