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
    const provincia = await this.provinciaRepository.findOne({
      where: { id_provincia: createUserDto.provinciaId },
    });
    if (!provincia) {
      throw new Error('Provincia no encontrada');
    }
    const localidad = await this.localidadRepository.findOne({
      where: { id_localidad: createUserDto.localidadId },
    });
    if (!localidad) {
      throw new Error('Localidad no encontrada');
    }
    const userExists = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (userExists) {
      throw new BadRequestException('El usuario ya existe.');
    }

    const usernameExists = await this.userRepository.findOne({ where: { email: createUserDto.username } });
    if (usernameExists) {
      throw new BadRequestException('El nombre de usuario ya existe.');
    }

    // Crear el usuario en Firebase
    const firebaseUser = await this.firebaseService.createFirebaseUser(createUserDto.email,createUserDto.banned, createUserDto.password);
    if (!firebaseUser) {
      throw new BadRequestException('Error al crear el usuario en Firebase');
    }
    // Crear el usuario en la base de datos
    const avatar = imagenesUrls.length > 0 ? imagenesUrls[imagenesUrls.length - 1] : null;

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
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    if(updateUserDto.password!=null){
    const firebaseUser = await this.firebaseService.updateFirebaseUser(updateUserDto.email, updateUserDto.password);}
    
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async banUser(updateEmail:string ,email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    const userUpdate = await this.userRepository.findOne({ where: { email:updateEmail } });
    if (user.role >= userUpdate.role&&userUpdate.role!=2) {
      throw new NotFoundException('no tienes rol suficiente.');
    }
    this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(user);
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
  async deleteUser(email: string): Promise<void> {
    // Buscar el usuario en la base de datos
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
    }

    if (user.avatar) {
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
