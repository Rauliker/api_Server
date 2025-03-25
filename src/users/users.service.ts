import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { User } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, name: user.name, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { secret: process.env.SECRET_KEY });
    return { accessToken };
  }

  async findAll(token: string): Promise<User[]> {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    return this.userRepository.find({ where: { id: userId } });

  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const userFindEmail = await this.userRepository.findOne({ where: { email:createUserDto.email } });
    if(userFindEmail){
      throw new UnauthorizedException('El email ya existe');    }
    
    const userFindName = await this.userRepository.findOne({ where: { username:createUserDto.username } });
    if(userFindName){
      throw new UnauthorizedException('El nombre de usuario ya existe');
    }
    if (createUserDto.password.length < 6 || createUserDto.password.length > 20) {
      throw new UnauthorizedException('La contraseña debe tener entre 6 y 20 caracteres');
    }
    
    const hasLetter = createUserDto.password.match(/[a-zA-Z]/);
    const hasNumber = createUserDto.password.match(/\d/);
    
    // Verificamos si la contraseña tiene letras y números
    if (!hasLetter || !hasNumber) {
      throw new UnauthorizedException('La contraseña debe tener al menos una letra y un número');
    }
    if(createUserDto.phone === undefined||createUserDto.phone === '' || createUserDto.phone === null){
      throw new UnauthorizedException('El número de teléfono es requerido');
    }
    if (createUserDto.phone.length !== 9) {
      throw new UnauthorizedException('El número de teléfono debe tener 9 dígitos');
    }
    if (!createUserDto.adress) {
      throw new UnauthorizedException('Has de poner tu direccion');
    }
    
    
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(token: string, updateUserDto: UpdateUserDto): Promise<User> {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const user = await this.userRepository.findOne({ where: {id: userId } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (updateUserDto.password && (updateUserDto.password.length < 6 || updateUserDto.password.length > 20)) {
      throw new UnauthorizedException('La contraseña debe tener entre 6 y 20 caracteres');
    }
    const userFindEmail = await this.userRepository.findOne({ where: { email:updateUserDto.email } });
    if(userFindEmail&&updateUserDto.email&&updateUserDto.email==userFindEmail.email){
      throw new UnauthorizedException('El email ya existe');
    }
    const userFindName = await this.userRepository.findOne({ where: { email:updateUserDto.username } });
    if(userFindName&&updateUserDto.username&&updateUserDto.username==userFindName.name){
      throw new UnauthorizedException('El nombre de usuario ya existe');
    }
    await this.userRepository.update(userId, updateUserDto);
    return this.userRepository.findOne({ where: { id:userId } });
  }

  async remove(token: string): Promise<void> {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const user = await this.userRepository.findOne({ where: { id:userId } });
    if (!user) {
      throw new NotFoundException('usuario no encontrado');
    }
    await this.userRepository.delete(userId);
  }
}
