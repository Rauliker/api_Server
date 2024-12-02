import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './imagen.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ImagenModule {}
