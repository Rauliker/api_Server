import { Module } from '@nestjs/common';
import { CourtTypeController } from './courtType.controller';
import { CourtTypeService } from './courtType.service';
@Module({
  imports: [],
  controllers: [CourtTypeController],
  providers: [CourtTypeService],
  exports: [CourtTypeService],
})
export class CourtTypeModule {}
