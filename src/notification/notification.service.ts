import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase_service';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly firebaseService: FirebaseService, 
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    
      ) {}
    async sendNotification(userID: string, pujaName: string, title:string, body:string) {
      
        const activeTokens = await this.tokenRepository
          .createQueryBuilder('token')
          .where('token.user_id = :userId', { userId: userID })
          .andWhere('token.fcmToken IS NOT NULL')
          .getMany();
        if (activeTokens.length === 0) {
          console.warn(`No se encontraron tokens activos para el usuario ${userID}.`);
          return;
        }
      
        for (const tokenObj of activeTokens) {
          try {
            if (!tokenObj.fcmToken || tokenObj.fcmToken.trim() === '') {
              console.warn(`Token inválido encontrado: "${tokenObj.fcmToken}"`);
              continue;
            }
      
            await this.firebaseService.sendNotification(
              tokenObj.fcmToken,
              title,
              body,
            );
      
            console.log(`Notificación enviada a: ${tokenObj.fcmToken}`);
          } catch (error) {
            console.error(`Error al enviar notificación al token ${tokenObj.fcmToken}:`, error);
          }
        }
      
        console.log(`Notificaciones enviadas a ${activeTokens.length} dispositivos.`);
      }
}