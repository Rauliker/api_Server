import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase_service';
import { Image } from 'src/imagen/imagen.entity';
import { Token } from 'src/notification/token.entity';
import { User } from 'src/users/users.entity';
import { PujaBid } from './pujaBid.entity';
import { PujaController } from './subastas.controller';
import { Puja } from './subastas.entity';
import { PujaService } from './subastas.service';
@Module({
  imports: [TypeOrmModule.forFeature([Puja, Image, User,PujaBid,Token])],
  controllers: [PujaController],
  providers: [PujaService,FirebaseService],
})
export class PujaModule {}
