import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase_service';
import { LocalidadModule } from 'src/localidad/localidad.module';
import { ProvinciaModule } from 'src/provincia/privincia.module';
import { UserController } from './users.controller';
import { User } from './users.entity';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),LocalidadModule,ProvinciaModule],
  controllers: [UserController],
  exports:[TypeOrmModule.forFeature([User])],
  providers: [UserService,FirebaseService],
})
export class UserModule {}
