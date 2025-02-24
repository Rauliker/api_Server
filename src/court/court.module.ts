import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CourtStatusModule } from 'src/courtStatus/courtStatus.module';
import { CourtTypeModule } from 'src/courtType/courtType.module';
import { CourtController } from './court.controller';
import { Court } from './court.entity';
import { CourtService } from './court.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Court]),
    CourtTypeModule,
    CourtStatusModule,
  ],
  controllers: [CourtController],
  providers: [CourtService],
  exports: [TypeOrmModule],

})
export class CourtModule {}
