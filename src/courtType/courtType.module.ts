import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtTypeController } from './courtType.controller';
import { CourtType } from './courtType.entity';
import { CourtTypeService } from './courtType.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourtType])],

  controllers: [CourtTypeController],
  providers: [CourtTypeService],
  exports: [TypeOrmModule],
})
export class CourtTypeModule {}
