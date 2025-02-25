import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';
import { AuthorizationMiddleware } from './authorization.middleware';

const uploadsPath = join(__dirname, '..', 'images');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath); // Crear carpeta si no existe
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const jwtService = app.get(JwtService);
  
  app.use(new AuthorizationMiddleware(jwtService).use.bind(new AuthorizationMiddleware(jwtService)));
  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '50mb' })); // Cambia el límite según sea necesario
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('API documentacio')
    .setDescription('API descripcion')
    .setVersion('1.0')
    .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
bootstrap();
