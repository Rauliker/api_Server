import { Module } from '@nestjs/common';
import { CourtStatusController } from './courtStatus.controller';
import { CourtStatusService } from './courtStatus.service';

@Module({
  imports: [],
  controllers: [CourtStatusController],
  providers: [CourtStatusService],
  exports: [CourtStatusService],
})
export class CourtStatusModule {}
