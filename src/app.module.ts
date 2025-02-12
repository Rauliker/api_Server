import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Image } from './imagen/imagen.entity';
import { ImagenModule } from './imagen/imagen.module';
import { Localidad } from './localidad/localidad.entity';
import { LocalidadModule } from './localidad/localidad.module';
import { Token } from './notification/token.entity';
import { ProvinciaModule } from './provincia/privincia.module';
import { Provincia } from './provincia/provinvia.entity';
import { PujaBid } from './subastas/pujaBid.entity';
import { Puja } from './subastas/subastas.entity';
import { PujaModule } from './subastas/subastas.module';
import { User } from './users/users.entity';
import { UserModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './images',
      limits: {
        fileSize: 5 * 1024 * 1024, // Límite de tamaño de archivo (5MB)
      },
      fileFilter: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        if (fileExtension !== '.jpg' && fileExtension !== '.jpeg' && fileExtension !== '.png') {
          return cb(new Error('Solo se permiten imágenes (JPG, JPEG, PNG)'), false);
        }
        cb(null, true);
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'images'),  // Ruta donde se almacenan los archivos subidos
      serveRoot: '/images',  // Prefijo para acceder a los archivos estáticos
    }),
    JwtModule.register({
      secret: 'mi_secreto_super_seguro', // Clave secreta para firmar el token
      signOptions: { expiresIn: '24h' },  // Expira en 1 hora
    }),
    ConfigModule.forRoot(),
    ProvinciaModule,
    ImagenModule,
    PujaModule,
    UserModule,
    LocalidadModule,
    UtilsModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'proyecto',
        // type: 'mysql',
        // host: process.env.DB_HOST || 'localhost',
        // port: parseInt(process.env.DB_PORT, 10) || 3306,
        // username: process.env.DB_USER || 'user',
        // password: process.env.DB_PASSWORD || 'password',
        // database: process.env.DB_NAME || 'mydb',
        entities: [
          Puja,
          Image,
          User,
          Localidad,
          Provincia,
          PujaBid,
          Token
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
