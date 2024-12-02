import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalidadModule } from 'src/localidad/localidad.module';
import { ProvinciaModule } from 'src/provincia/privincia.module';
import { UserController } from './users.controller';
import { User } from './users.entity';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),LocalidadModule,ProvinciaModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
