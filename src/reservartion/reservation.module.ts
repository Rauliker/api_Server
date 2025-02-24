import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtModule } from 'src/court/court.module';
import { ReservationStatusModule } from 'src/reservationStatus/reservationStatus.module';
import { UserModule } from 'src/users/users.module';
import { ReservationController } from './reservation.controller';
import { Reservation } from './reservation.entity';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
  UserModule,
  CourtModule,
  ReservationStatusModule,
  TypeOrmModule.forFeature([Reservation]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [TypeOrmModule],
})
export class ReservationModule {}
