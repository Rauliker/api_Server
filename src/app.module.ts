import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Image } from './imagen/imagen.entity';
import { ImagenModule } from './imagen/imagen.module';
import { Localidad } from './localidad/localidad.entity';
import { LocalidadModule } from './localidad/localidad.module';
import { ProvinciaModule } from './provincia/privincia.module';
import { Provincia } from './provincia/provinvia.entity';
import { Puja } from './sujastas/puja.entity';
import { PujaModule } from './sujastas/puja.module';
import { PujaBid } from './sujastas/pujaBid.entity';
import { User } from './users/users.entity';
import { UserModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProvinciaModule,
    ImagenModule,
    PujaModule,
    UserModule,
    LocalidadModule,
    UtilsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'proyecto',
        entities: [
          Puja,
          Image,
          User,
          Localidad,
          Provincia,
          PujaBid
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
