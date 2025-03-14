import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Not, Repository } from 'typeorm';
import { Court } from '../court/court.entity';
import { User } from '../users/users.entity';
import { CreateReservationDto } from './reservation.dto';
import { Reservation, ReservationStatusEnum } from './reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(ReservationService.name);

  // Función para obtener el nombre del día de la semana
  private getDayName(date: Date): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
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
    
    const user = await this.reservationRepository.find({ where: { user:{id:userId, email},status:ReservationStatusEnum.CREATED }, relations: ['user', 'court'] });
    if(user){
      return user;
    }else{
      throw new NotFoundException('Reservation not found');
    }
  }
  async getReservationsByUserEmailHistorial(email: string, token: string) {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;

    const user = await this.reservationRepository.find({ where: { user:{id:userId, email},status:Not(ReservationStatusEnum.CREATED) }, relations: ['user', 'court'] });
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
      throw new BadRequestException('Invalid date format');
    }

    if (reservationDate < today) {
      throw new BadRequestException('Cannot create reservation for past date');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const court = await this.courtRepository.findOneBy({ id: courtId });
    if (!court) {
      throw new NotFoundException('Court not found');
    }

    // Obtener el nombre del día de la semana
    const dayName = this.getDayName(reservationDate);
    // Verificar si la pista está disponible en el día y hora seleccionados
    const availability = court.availability[dayName];
    if (!availability) {
      throw new BadRequestException(`Court is not available on ${dayName}`);
    }

    if (!this.isTimeAvailable(availability, startTime, endTime)) {
      throw new BadRequestException(`Court is not available at the selected time on ${dayName}`);
    }

    const existingReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.courtId = :courtId', { courtId })
      .andWhere('reservation.date = :date', { date: date })
      .andWhere('reservation.status="created"')
      .getMany();

    for (const reservation of existingReservations) {
      this.logger.log(`Checking existing reservation: ${reservation.date} from ${reservation.startTime} to ${reservation.endTime}`);

      if (this.isTimeOverlap(reservation.startTime, reservation.endTime, startTime, endTime) ) {
        
        throw new BadRequestException('There are existing reservations for this court on the selected date and time.');
        
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
      throw new NotFoundException('Reservation not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservationDate = new Date(date);
    if (isNaN(reservationDate.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (reservationDate < today) {
      throw new BadRequestException('Cannot update reservation to a past date');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const court = await this.courtRepository.findOneBy({ id: courtId });
    if (!court) {
      throw new NotFoundException('Court not found');
    }

    const dayName = this.getDayName(reservationDate);

    const availability = court.availability[dayName];
    if (!availability) {
      throw new BadRequestException(`Court is not available on ${dayName}`);
    }

    if (!this.isTimeAvailable(availability, startTime, endTime)) {
      throw new BadRequestException(`Court is not available at the selected time on ${dayName}`);
    }

    const existingReservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.courtId = :courtId', { courtId })
      .andWhere('reservation.date = :date', { date: date })
      .andWhere('reservation.id != :reservationId', { reservationId })
      .andWhere('reservation.status="created"')
      .getMany();

    for (const existingReservation of existingReservations) {
      this.logger.log(`Checking existing reservation: ${existingReservation.date} from ${existingReservation.startTime} to ${existingReservation.endTime}`);

      if (this.isTimeOverlap(existingReservation.startTime, existingReservation.endTime, startTime, endTime) || 
          (startTime === '09:00' && endTime === '11:00') || 
          (startTime === '08:00' && endTime === '10:00')) {

        throw new BadRequestException('There are existing reservations for this court on the selected date and time.');
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
      throw new NotFoundException('Reservation not found');
    }
      if ([ReservationStatusEnum.FINISHED, ReservationStatusEnum.REJECTED].includes(reservation.status)) {
        throw new BadRequestException('Cannot cancel a finished or rejected reservation');
      }
  
      reservation.status = ReservationStatusEnum.REJECTED;
  
      return this.reservationRepository.save(reservation);
    

    
  }
  @Cron("* 15 * * * *")
  async handleCron() {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().split(' ')[0].slice(0, 5); 
    const reservations = await this.reservationRepository.find({
      where: {
      status: ReservationStatusEnum.CREATED,
      date: LessThanOrEqual(new Date(currentDate)),
      endTime: LessThanOrEqual(currentTime),
      },
    });

    for (const reservation of reservations) {

      reservation.status = ReservationStatusEnum.FINISHED;
      await this.reservationRepository.save(reservation);
      this.logger.log(`Reservation ${reservation.id} has been marked as finished.`);
    }
    
  }
}
