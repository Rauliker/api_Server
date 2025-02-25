import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Court } from '../court/court.entity';
import { ReservationStatus } from '../reservationStatus/reservationStatus.entity';
import { User } from '../users/users.entity';
import { CreateReservationDto } from './reservation.dto';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(ReservationStatus)
    private statusRepository: Repository<ReservationStatus>,
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
  private isTimeOverlap(existingStartTime: string, existingEndTime: string, newStartTime: string, newEndTime: string): boolean {
    return (
      (newStartTime < existingEndTime && newStartTime >= existingStartTime) || 
      (newEndTime > existingStartTime && newEndTime <= existingEndTime) ||
      (newStartTime <= existingStartTime && newEndTime >= existingEndTime)
    );
  }

  async createReservation(createReservationDto: CreateReservationDto) {
    const { userId, courtId, date, startTime, endTime, statusId } = createReservationDto;

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

    let status = statusId ? await this.statusRepository.findOneBy({ id: statusId }) : null;
    if (!status) {
      status = await this.statusRepository.findOne({ where: { name: 'Creada' } });
      if (!status) throw new NotFoundException('Default status "created" not found');
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
      .getMany();

    for (const reservation of existingReservations) {
        this.logger.log('This is a log message');
      if (
        this.isTimeOverlap(reservation.startTime, reservation.endTime, startTime, endTime)
      ) {
        throw new BadRequestException('There are existing reservations for this court on the selected date and time.');
      }
    }

    const reservation = this.reservationRepository.create({
      user,
      court,
      date: date,
      startTime,
      endTime,
      status,
    });

    return this.reservationRepository.save(reservation);
  }

  async cancelReservation(reservationId: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['status'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (['Completada', 'Cancelada'].includes(reservation.status.name.toLowerCase())) {
      throw new BadRequestException('Cannot cancel a completed or already canceled reservation');
    }

    const canceledStatus = await this.statusRepository.findOne({
      where: { name: 'Cancelada' },
    });

    if (!canceledStatus) {
      throw new NotFoundException('Canceled status not found');
    }

    reservation.status = canceledStatus;
    return this.reservationRepository.save(reservation);
  }
}
