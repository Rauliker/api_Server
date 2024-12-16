import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/imagen/imagen.entity';
import { User } from 'src/users/users.entity';
import { PujaBid } from './pujaBid.entity';
import { PujaController } from './subastas.controller';
import { Puja } from './subastas.entity';
import { PujaService } from './subastas.service';
@Module({
  imports: [TypeOrmModule.forFeature([Puja, Image, User,PujaBid])],
  controllers: [PujaController],
  providers: [PujaService],
})
export class PujaModule {}
