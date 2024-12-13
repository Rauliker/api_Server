import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase_service';
import { Localidad } from 'src/localidad/localidad.entity';
import { Provincia } from 'src/provincia/provinvia.entity';
import { Repository } from 'typeorm';
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
    private readonly firebaseService: FirebaseService, // Inyecta FirebaseService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
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
    if (userExists) {
      throw new BadRequestException('El nombre de usuario ya existe.');
    }

    // Crear el usuario en Firebase
    const firebaseUser = await this.firebaseService.createFirebaseUser(createUserDto.email,createUserDto.banned, createUserDto.password);
    if (!firebaseUser) {
      throw new BadRequestException('Error al crear el usuario en Firebase');
    }

    // Crear el usuario en la base de datos
    const user = this.userRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password, 
      role: createUserDto.role,
      banned: createUserDto.banned,
      balance: createUserDto.balance,
      calle: createUserDto.calle,
      provincia,
      localidad
    });

    return this.userRepository.save(user);
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['provincia','localidad','createdPujas','pujaBids'] });
  }

  async findOne(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ['provincia','localidad','createdPujas','pujaBids'] });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email, password, banned: false  }, relations: ['provincia','localidad','createdPujas','pujaBids'] });
    if (!user) {
      throw new NotFoundException('Credenciales incorrectas.');
    }
    return user;
  }
  async deleteUser(email: string): Promise<void> {
    // Verificar si el usuario existe en la base de datos
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    // Eliminar el usuario de Firebase
    try {
      await this.firebaseService.deleteFirebaseUser(email);
    } catch (error) {
      throw new BadRequestException('Error al eliminar el usuario de Firebase: ' + error.message);
    }

    // Eliminar el usuario de la base de datos
    await this.userRepository.remove(user);
  }
}
