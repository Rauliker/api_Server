import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
//import { authorizationMiddleware } from './authorization.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.use(authorizationMiddleware);
  app.use(bodyParser.json({ limit: '50mb' })); // Cambia el límite según sea necesario
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(3000);
}
bootstrap();
