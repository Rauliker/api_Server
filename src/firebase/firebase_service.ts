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
        disabled: !active
      });
      return userRecord;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async authenticateFirebaseUser(email: string, password: string) {
    // Aquí puedes implementar la lógica de autenticación usando Firebase Auth
    // Firebase Auth SDK no tiene un método directo para login con email y contraseña desde el backend,
    // por lo que normalmente usas la API REST de Firebase o el SDK del cliente en el frontend.
  }
}
