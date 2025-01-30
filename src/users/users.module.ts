import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase_service';
import { LocalidadModule } from 'src/localidad/localidad.module';
import { NotificationService } from 'src/notification/notification.service';
import { ProvinciaModule } from 'src/provincia/privincia.module';
import { Puja } from 'src/subastas/subastas.entity';
import { Token } from '../notification/token.entity';
import { UserController } from './users.controller';
import { User } from './users.entity';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User,Puja,Token]),LocalidadModule,ProvinciaModule],
  controllers: [UserController],
  exports:[TypeOrmModule.forFeature([User])],
  providers: [UserService,FirebaseService, NotificationService],
})
export class UserModule {}
