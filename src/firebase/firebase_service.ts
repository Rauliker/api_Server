import { Injectable, Logger } from '@nestjs/common';
import { config } from 'dotenv';
import * as admin from 'firebase-admin';
import * as path from 'path';

config(); // Carga las variables de entorno del archivo .env

@Injectable()
export class FirebaseService {
  constructor() {
    const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH || '';
    if (!serviceAccountPath) {
      throw new Error('Firebase credentials path is not defined.');
    }

    const serviceAccount = require(path.resolve(serviceAccountPath));

    // Verificar si Firebase ya está inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  getFirestore() {
    return admin.firestore();
  }

  // Métodos para interactuar con Firebase
  async createFirebaseUser(email: string, active: boolean, password: string) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        disabled: !active,
      });
      return userRecord;
    } catch (error) {
      throw new Error(error.message);
    }
  } 
  
  private readonly logger = new Logger(FirebaseService.name);
  async sendNotification(
    token: string,
    title: string,
    body: string,
    data: Record<string, any> = {},
  ): Promise<void> {
    try {
      if (!token || token.trim() === '') {
        throw new Error('Token de notificación inválido.');
      }
  
      const message = {
        notification: {
          title,
          body,
        },
        data,
        token,
      };
  
      this.logger.debug('Enviando notificación:', JSON.stringify(message, null, 2));
      const response = await admin.messaging().send(message);
      console.log('Notificación enviada con éxito:', response);
    } catch (error) {
      if (error.code === 'messaging/invalid-registration-token') {
        console.error('El token de notificación no es válido:', token);
      } else if (error.code === 'messaging/registration-token-not-registered') {
        console.error('El token ya no está registrado en FCM:', token);
      } else {
        console.error('Error desconocido al enviar la notificación:', error);
      } 
    } 
  }
  

  async loginFirebaseUser(email: string, password: string) {
    try {
      // Verificar el usuario en Firebase Authentication
      const userRecord = await admin.auth().getUserByEmail(email);

      if (!userRecord) {
        throw new Error('Usuario no encontrado.');
      }

      // Generar un token personalizado para el usuario
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      return {
        message: 'Inicio de sesión exitoso.',
        token: customToken,
      };
    } catch (error) {
      throw new Error('Error al iniciar sesión con Firebase: ' + error.message);
    }
  }

  async getToken(email: string): Promise<string> {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);

      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      return customToken;
    } catch (error) {
      throw new Error(`Error al obtener el token del usuario: ${error.message}`);
    }
  }

  async updateFirebaseUser(email: string, password: string) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const userUpdate = await admin.auth().updateUser(userRecord.uid, {
        email,
        password,
      });
      return userUpdate;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteFirebaseUser(email: string): Promise<void> {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
    } catch (error) {
      throw new Error('No se pudo eliminar el usuario de Firebase: ' + error.message);
    }
  }
}
