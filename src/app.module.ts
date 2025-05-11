import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Court } from './court/court.entity';
import { CourtModule } from './court/court.module';
import { CourtStatus } from './courtStatus/courtStatus.entity';
import { CourtStatusModule } from './courtStatus/courtStatus.module';

import { CourtType } from './courtType/courtType.entity';
import { CourtTypeModule } from './courtType/courtType.module';
import { Reservation } from './reservartion/reservation.entity';
import { ReservationModule } from './reservartion/reservation.module';
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
      rootPath: path.join(__dirname, '..', 'images'),
      serveRoot: '/images',
      serveStaticOptions: {
        index: false,
      },
    }),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
            const secretKey = configService.get<string>('SECRET_KEY');
        return {
          secret: secretKey,
          signOptions: { expiresIn: '48h' },
        };
      },
      inject: [ConfigService],
    }),
    
    ConfigModule.forRoot({
      envFilePath: '.env',  // Asegura que el archivo .env se cargue
      isGlobal: true,        // Para que todas las variables de entorno estén accesibles globalmente
    }),
    CourtModule,
    CourtTypeModule,
    CourtStatusModule,
    ReservationModule,
    UserModule,
    UtilsModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // type: 'mysql',
        // host: 'localhost',
        // port: 3306,
        // username: 'root',
        // password: '',
        // database: 'api',
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
        username: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'api',
        entities: [
          Reservation,
          CourtStatus,
          CourtType,
          Court,
          User,
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
