import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async createReservation(createReservationDto: CreateReservationDto) {
    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(createReservationDto.date) < today) {
      throw new BadRequestException('Cannot create reservation for past date');
    }

    // Get related entities
    const user = await this.userRepository.findOneBy({ id: createReservationDto.userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const court = await this.courtRepository.findOneBy({ id: createReservationDto.courtId });
    if (!court) {
      throw new NotFoundException('Court not found');
    }


    const status = await this.statusRepository.findOneBy({ id: createReservationDto.statusId });
    if (!status) {
      throw new NotFoundException('Status not found');
    }


    // Create and save reservation
    const reservation = this.reservationRepository.create({
      user,
      court,
      date: createReservationDto.date,
      startTime: createReservationDto.startTime,
      endTime: createReservationDto.endTime,
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

    // Check if reservation is already completed or canceled
    if (['completed', 'canceled'].includes(reservation.status.name.toLowerCase())) {
      throw new BadRequestException('Cannot cancel a completed or already canceled reservation');
    }

    // Get canceled status
    const canceledStatus = await this.statusRepository.findOne({
      where: { name: 'Canceled' },
    });

    if (!canceledStatus) {
      throw new NotFoundException('Canceled status not found');
    }

    // Update status to canceled
    reservation.status = canceledStatus;
    return this.reservationRepository.save(reservation);
  }
}
