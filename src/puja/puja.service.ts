import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/imagen/imagen.entity';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { CreatePujaDto, MakeBidDto } from './puja.dto';
import { Puja } from './puja.entity';
import { PujaBid } from './pujaBid.entity';

@Injectable()
export class PujaService {
  constructor(
    @InjectRepository(Puja)
    private pujaRepository: Repository<Puja>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PujaBid) private readonly pujaBidRepository: Repository<PujaBid>,
    @InjectRepository(Image)
    private imagenRepository: Repository<Image>,  
  ) {}

  async createPuja(createPujaDto: CreatePujaDto): Promise<Puja> {
    const creator = await this.userRepository.findOne({ where: { email: createPujaDto.creatorId } });
    if (!creator) {
      throw new NotFoundException('Creador no encontrado.');
    }

    // Transformar las imágenes de strings a objetos Imagen
    const imagenes = await Promise.all(
      createPujaDto.imagenes.map(async (url) => {
        const imagen = new Image();
        imagen.url = url;  // Asumir que la entidad Imagen tiene un campo `url`
        return imagen;
      }),
    );

    const puja = this.pujaRepository.create({
      ...createPujaDto,
      creator,  // Asocia el creador
      imagenes,  // Asocia las imágenes transformadas
    });

    return this.pujaRepository.save(puja);
  }

  async findAll(): Promise<Puja[]> {
    return this.pujaRepository.find({ relations: ['creator', 'imagenes','pujas'] });
  }

  async findOne(id: number): Promise<Puja> {
    const puja = await this.pujaRepository.findOne({ where: { id }, relations: ['creator', 'imagenes','pujas'] });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada.');
    }
    return puja;
  }

  async makeBid(makeBidDto: MakeBidDto): Promise<PujaBid> {
    const { userId, pujaId, bidAmount } = makeBidDto;

    // Verificar que la puja existe
    const puja = await this.pujaRepository.findOne({ where: { id: pujaId }, relations: ['pujas','creator'] });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada');
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { email: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    if (puja.creator.email === userId) {
      throw new NotFoundException('El creador de la puja no puede realizar una puja.');
    }
  
    // Validación 2: Verificar que la fecha límite no haya pasado
    const currentDate = new Date();
    if (currentDate > puja.fechaFin) {
      throw new NotFoundException('La fecha límite para esta puja ha expirado.');
    }

    // Crear la nueva puja (bid)
    const newBid = this.pujaBidRepository.create({ user, puja, amount: bidAmount });

    // Guardar la nueva puja
    return await this.pujaBidRepository.save(newBid);
  }
  async deletePuja(id: number): Promise<string> {
    const puja = await this.pujaRepository.findOne({ where: { id }, relations: ['pujas'] });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada');
    }

    // Al eliminar la puja, también se eliminan las pujas relacionadas (bids) gracias a onDelete: 'CASCADE'
    await this.pujaRepository.remove(puja);

    return `Puja con ID ${id} y sus bids relacionadas fueron eliminadas`;
  }
}  
