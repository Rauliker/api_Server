import { Injectable } from '@nestjs/common';
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

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  getFirestore() {
    return admin.firestore();
  }
// Métodos para interactuar con Firebase
async createFirebaseUser(email: string,active:boolean, password: string) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        disabled: active
      });
      return userRecord;
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
