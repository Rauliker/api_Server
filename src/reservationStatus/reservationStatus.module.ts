import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationStatusController } from './reservationStatus.controller';
import { ReservationStatus } from './reservationStatus.entity';
import { ReservationStatusService } from './reservationStatus.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationStatus])],
  controllers: [ReservationStatusController],
  providers: [ReservationStatusService],
  exports: [TypeOrmModule],
})
export class ReservationStatusModule {}
