import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationStatusDto, UpdateReservationStatusDto } from './reservationStatus.dto';
import { ReservationStatus } from './reservationStatus.entity';

@Injectable()
export class ReservationStatusService {
  constructor(
    @InjectRepository(ReservationStatus)
    private readonly reservationStatusRepository: Repository<ReservationStatus>,
  ) {}

  async createReservationStatus(createDto: CreateReservationStatusDto): Promise<ReservationStatus> {
    const status = this.reservationStatusRepository.create(createDto);
    return await this.reservationStatusRepository.save(status);
  }

  async getAllReservationStatuses(): Promise<ReservationStatus[]> {
    return await this.reservationStatusRepository.find();
  }

  async getReservationStatusById(id: number): Promise<ReservationStatus> {
    const status = await this.reservationStatusRepository.findOne({ where: { id } });
    if (!status) {
      throw new NotFoundException(`Reservation status with ID ${id} not found`);
    }
    return status;
  }

  async updateReservationStatus(
    id: number,
    updateDto: UpdateReservationStatusDto,
  ): Promise<ReservationStatus> {
    const status = await this.getReservationStatusById(id);
    this.reservationStatusRepository.merge(status, updateDto);
    return await this.reservationStatusRepository.save(status);
  }

  async deleteReservationStatus(id: number): Promise<void> {
    const status = await this.getReservationStatusById(id);
    await this.reservationStatusRepository.remove(status);
  }
}
