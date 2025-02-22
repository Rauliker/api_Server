import { Module } from '@nestjs/common';
import { ReservationStatusController } from './reservationStatus.controller';
import { ReservationStatusService } from './reservationStatus.service';

@Module({
  imports: [],
  controllers: [ReservationStatusController],
  providers: [ReservationStatusService],
  exports: [ReservationStatusService],
})
export class ReservationStatusModule {}
