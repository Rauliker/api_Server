import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinciaModule } from 'src/provincia/privincia.module';
import { LocalidadController } from './localidad.controller';
import { Localidad } from './localidad.entity';
import { LocalidadService } from './localidad.service';

@Module({
  imports: [TypeOrmModule.forFeature([Localidad]), ProvinciaModule],
  exports: [TypeOrmModule.forFeature([Localidad])],
  controllers: [LocalidadController],
  providers: [LocalidadService],
})
export class LocalidadModule {}
