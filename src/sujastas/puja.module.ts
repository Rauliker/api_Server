import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from 'src/imagen/imagen.entity';
import { User } from 'src/users/users.entity';
import { PujaController } from './puja.controller';
import { Puja } from './puja.entity';
import { PujaService } from './puja.service';
import { PujaBid } from './pujaBid.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Puja, Image, User,PujaBid])],
  controllers: [PujaController],
  providers: [PujaService],
})
export class PujaModule {}
