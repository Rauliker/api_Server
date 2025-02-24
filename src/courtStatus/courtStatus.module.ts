import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtStatusController } from './courtStatus.controller';
import { CourtStatus } from './courtStatus.entity';
import { CourtStatusService } from './courtStatus.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourtStatus])],
  controllers: [CourtStatusController],
  providers: [CourtStatusService],
  exports: [TypeOrmModule],
})
export class CourtStatusModule {}
