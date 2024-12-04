import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puja } from 'src/sujastas/puja.entity';
import { Image } from './imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image,Puja])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ImagenModule {}
