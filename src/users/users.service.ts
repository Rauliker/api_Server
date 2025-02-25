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
      throw new UnauthorizedException('Email already exists');
    }
    const userFindName = await this.userRepository.findOne({ where: { email:createUserDto.name } });
    if(userFindName){
      throw new UnauthorizedException('Username already exists');
    }
    if (createUserDto.password.length < 6 || createUserDto.password.length > 20) {
      throw new UnauthorizedException('Password must be between 6 and 20 characters long');
    }
    
    if (createUserDto.password.length < 6 || createUserDto.password.length > 20) {
      throw new UnauthorizedException('Password must be at least 6 characters long');
    }
    
    const hasLetter = createUserDto.password.match(/[a-zA-Z]/);
    const hasNumber = createUserDto.password.match(/\d/);
    
    // Verificamos si la contraseña tiene letras y números
    if (!hasLetter || !hasNumber) {
      throw new UnauthorizedException('Password must contain both letters and numbers');
    }
    
    
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(token: string, updateUserDto: UpdateUserDto): Promise<User> {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const user = await this.userRepository.findOne({ where: {id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.update(userId, updateUserDto);
    return this.userRepository.findOne({ where: { id:userId } });
  }

  async remove(token: string): Promise<void> {
    const decodedToken = this.jwtService.verify(token, { secret: process.env.SECRET_KEY });
    const userId = decodedToken.sub;
    const user = await this.userRepository.findOne({ where: { id:userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(userId);
  }
}
