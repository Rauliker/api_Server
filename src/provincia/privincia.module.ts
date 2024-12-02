import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciaController } from './provincia.controller';
import { ProvinciaService } from './provincia.service';
import { Provincia } from './provinvia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Provincia])],
  controllers: [ProvinciaController],
  exports: [TypeOrmModule.forFeature([Provincia])],
  providers: [ProvinciaService],
})
export class ProvinciaModule {}
