import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { FirebaseService } from 'src/firebase/firebase_service';
import { Localidad } from 'src/localidad/localidad.entity';
import { Provincia } from 'src/provincia/provinvia.entity';
import { Puja } from 'src/subastas/subastas.entity';
import { Not, Repository } from 'typeorm';
import { Token } from '../notification/token.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Localidad)
      private readonly localidadRepository: Repository<Localidad>,
      
      @InjectRepository(Provincia)
      private readonly provinciaRepository: Repository<Provincia>,
      @InjectRepository(Puja)
      private readonly subastaRepository: Repository<Puja>,

      @InjectRepository(Token)
      private readonly tokenRepository: Repository<Token>,
    private readonly firebaseService: FirebaseService, 
  ) {}

  async createUser(createUserDto: CreateUserDto, imagenesUrls: string[]): Promise<User> {
    // Validar que el email no sea null ni vacío
    if (!createUserDto.email || createUserDto.email.trim() === '') {
      throw new BadRequestException('El email es obligatorio.');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserDto.email)) {
      throw new BadRequestException('El email no tiene un formato válido.');
    }

    // Validar que el nombre de usuario no sea null ni vacío
    if (!createUserDto.username || createUserDto.username.trim() === '') {
      throw new BadRequestException('El nombre de usuario es obligatorio.');
    }

    // Verificar si el usuario ya existe por email
    const userExists = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (userExists) {
      throw new BadRequestException('El usuario ya existe.');
    }

    // Verificar si el usuario ya existe por nombre de usuario
    const usernameExists = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (usernameExists) {
      throw new BadRequestException('El nombre de usuario ya existe.');
    }

    if (!createUserDto.calle || createUserDto.calle.trim() === '') {
      throw new BadRequestException('La calle es obligatoria.');
    }

    // Validar provincia y localidad
    const provincia = await this.provinciaRepository.findOne({
      where: { id_provincia: createUserDto.provinciaId },
    });

    const localidad = await this.localidadRepository.findOne({
      where: { id_localidad: createUserDto.localidadId },
    });

    if (!provincia) {
      if (!localidad) {
        throw new BadRequestException('Provincia y localidad no encontradas.');
      } else {
        createUserDto.provinciaId = localidad.provincia.id_provincia;
      }
    }

    if (!localidad) {
      throw new BadRequestException('Localidad no encontrada.');
    }

    // Validar contraseña
    if (!createUserDto.password || createUserDto.password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres.');
    }

    // Validar y corregir el rol si es mayor a 2
    if (createUserDto.role > 2) {
      createUserDto.role = 2;
    }

    // Crear el usuario en Firebase
    const firebaseUser = await this.firebaseService.createFirebaseUser(
      createUserDto.email,
      createUserDto.banned,
      createUserDto.password
    );
    if (!firebaseUser) {
      throw new BadRequestException('Error al crear el usuario en Firebase');
    }

    // Obtener el avatar (última imagen o un valor por defecto)
    const avatar = imagenesUrls && imagenesUrls.length > 0 ? imagenesUrls[imagenesUrls.length - 1] : 'no';

    // Crear y guardar el usuario en la base de datos
    const user = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
      avatar: avatar,
      role: createUserDto.role,
      banned: createUserDto.banned,
      balance: createUserDto.balance,
      calle: createUserDto.calle,
      provincia,
      localidad,
    });

    return this.userRepository.save(user);
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userEdit = await this.userRepository.findOne({ where: { email } });
    if (!userEdit) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Buscar al usuario por email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Evitar que el email sea modificado
    if (updateUserDto.email && updateUserDto.email !== email) {
      throw new BadRequestException('No puedes cambiar el email.');
    }

    // Si se proporciona una contraseña, actualizarla en Firebase
    if (updateUserDto.password) {
      await this.firebaseService.updateFirebaseUser(email, updateUserDto.password);
    }

    // Validaciones antes de aplicar `merge`
    const updatedData: Partial<User> = {};

    if (updateUserDto.username !== null) {
      updatedData.username = updateUserDto.username;
    }
    if (updateUserDto.avatar !== null) {
      updatedData.avatar = updateUserDto.avatar;
    }
    if (updateUserDto.role !== null) {
      if (userEdit.role > 2) {
        updatedData.role = 2;
      } else if (userEdit.role <= updateUserDto.role) {
        updatedData.role = updateUserDto.role; 
      } else {
        updatedData.role = userEdit.role;
      }
    }
    if (updateUserDto.banned !== null) {
      updatedData.banned = updateUserDto.banned;
    }
    if (updateUserDto.balance !== null) {
      updatedData.balance = updateUserDto.balance;
    }
    if (updateUserDto.calle !== null) {
      updatedData.calle = updateUserDto.calle;
    }

    if (updateUserDto.localidadId !== null) {
      const localidad = await this.localidadRepository.findOne({ where: { id_localidad: updateUserDto.localidadId } });
      if (localidad) {
        
        updatedData.provincia = localidad.provincia;
        updatedData.localidad = localidad;
      }
    }

    // Usar merge para actualizar solo los campos permitidos
    this.userRepository.merge(user, updatedData);

    return this.userRepository.save(user);
  }

  async banUser(updateEmail: string, email: string): Promise<User> {
    // Buscar al usuario que está intentando hacer el cambio
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    // Buscar al usuario que será baneado
    const userUpdate = await this.userRepository.findOne({ where: { email: updateEmail } });
    if (!userUpdate) {
      throw new NotFoundException('Usuario a banear no encontrado.');
    }
  
    // Verificar que el usuario tiene el rol suficiente para banear
    if (user.role >= userUpdate.role && userUpdate.role !== 2) {
      throw new NotFoundException('No tienes rol suficiente para banear a este usuario.');
    }
  
    userUpdate.banned = !userUpdate.banned; 
    await this.userRepository.save(userUpdate);  // Guardar los cambios en la base de datos
  
    return userUpdate;  // Retornar el usuario actualizado
  }
  

  async updatePass(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async findAllExcpt(id: string): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { email: Not(id) },
      relations: ['provincia', 'localidad', 'createdPujas', 'pujaBids'],
    });
    let newUsers = [];
    for (const user of users) {
      let balancePujas = 0;
      if (user.pujaBids) {
        for (const pujaBid of user.pujaBids) {
          const puja = await this.subastaRepository.findOne({
            where: { pujas: pujaBid },
          });
          if (puja && puja.fechaFin < new Date()) {
            continue;
          }
          balancePujas += pujaBid.amount;
        }
      }
      user.balance =user.balance - balancePujas;
      newUsers.push(user);
    }
    return newUsers;
  }

  async findAll(): Promise<User[]> {
    const users= await this.userRepository.find({ relations: ['provincia','localidad','createdPujas','pujaBids'] });
    
    let newUsers = [];
    for (const user of users) {
      let balancePujas = 0;
      if (user.pujaBids) {
        for (const pujaBid of user.pujaBids) {
          const puja = await this.subastaRepository.findOne({
            where: { pujas: pujaBid },
          });
          if (puja && puja.fechaFin < new Date()) {
            continue;
          }
          balancePujas += pujaBid.amount;
        }
      }
      user.balance =user.balance - balancePujas;
      newUsers.push(user);
    }
    return newUsers;
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['provincia', 'localidad', 'createdPujas', 'pujaBids', 'tokens'],
    });
  
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    const activeTokens = user.tokens.filter(token => !token.loggedOutAt);
  
    let balancePujas = 0;
    if (user.pujaBids) {
      for (const pujaBid of user.pujaBids) {
        const puja = await this.subastaRepository.findOne({
          where: { pujas: pujaBid },
        });
        if (puja && puja.fechaFin < new Date()) {
          continue;
        }
        balancePujas += pujaBid.amount;
      }
    }
  
    user.balance = user.balance - balancePujas;
    user.balance = parseFloat(user.balance.toFixed(2));
  
    user.tokens = activeTokens;
  
    return user;
  }
  

  async login(email: string, password: string, deviceInfo: string, fcmToken?: string): Promise<User> {
    let user = await this.userRepository.findOne({ where: { email, password, banned: false  }});
    if (!user) {
      throw new NotFoundException('Credenciales incorrectas.');     
    }
    const firebase_login = await this.firebaseService.loginFirebaseUser(email, password);
    if (!firebase_login) {
      throw new BadRequestException('Error al iniciar sesión con Firebase');
    }
    const token = firebase_login.token;
    const tokenRecord = this.tokenRepository.create({
      user: user,
      token: token,
      deviceInfo: deviceInfo,
      fcmToken: fcmToken,
      createdAt: new Date(),
    });
    await this.tokenRepository.save(tokenRecord);
    user = await this.userRepository.findOne({ where: { email, password, banned: false  }, relations: ['provincia','localidad','createdPujas','pujaBids', 'tokens'] });
    const activeTokens = user.tokens.filter(token => !token.loggedOutAt);
  
    let balancePujas = 0;
    if (user.pujaBids) {
      for (const pujaBid of user.pujaBids) {
        const puja = await this.subastaRepository.findOne({
          where: { pujas: pujaBid },
        });
        if (puja && puja.fechaFin < new Date()) {
          continue;
        }
        balancePujas += pujaBid.amount;
      }
    }
  
    user.balance = user.balance - balancePujas;
    user.balance = parseFloat(user.balance.toFixed(2));
  
    user.tokens = activeTokens;
  
    return user;
  }
  async deleteUser(email: string, emailDeleter: string): Promise<void> {
    // Buscar el usuario en la base de datos
    const deleter = await this.userRepository.findOne({ where: { email: emailDeleter } });
    if (!deleter) {
        throw new NotFoundException('Usuario no encontrado.');
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
    }
    if (deleter.role<=user.role) {
      throw new BadRequestException('No tienes los permisis suficiente');
    }

    if (user.avatar!="no") {
        const filePath = `.${user.avatar}`;
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (err) {
            throw new BadRequestException(
                `Error al eliminar el archivo de avatar: ${err.message}`
            );
        }
    }

    // Eliminar el usuario de Firebase
    try {
        await this.firebaseService.deleteFirebaseUser(email);
    } catch (error) {
        throw new BadRequestException(
            `Error al eliminar el usuario de Firebase: ${error.message}`
        );
    }

    // Eliminar el usuario de la base de datos
    await this.userRepository.remove(user);
  }
  async logout(email: string, device: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    // Buscar los tokens del usuario
    const tokens = await this.tokenRepository.find({ where: { user: user, deviceInfo:device } });
  
    // Borrar los tokens para marcar el cierre de sesión

    await this.tokenRepository.remove(tokens);
    
  }
  
}
