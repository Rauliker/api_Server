import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.pujaRepository.find({ relations: ['creator', 'imagenes'] });
  }

  async findOne(id: number): Promise<Puja> {
    const puja = await this.pujaRepository.findOne({ where: { id }, relations: ['creator', 'imagenes'] });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada.');
    }
    return puja;
  }

  async makeBid(makeBidDto: MakeBidDto): Promise<Puja> {
    const { pujaId, userId, bidAmount } = makeBidDto;
    const puja = await this.pujaRepository.findOne({ where: { id: pujaId }, relations: ['creator', 'pujas'] });
  
    if (!puja) {
      throw new NotFoundException('Subasta no encontrada.');
    }
  
    const user = await this.userRepository.findOne({ where: { email: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
  
    if (puja.creator.email === userId) {
      throw new BadRequestException('No puedes pujar en tu propia subasta.');
    }
  
    if (new Date() > new Date(puja.fechaFin)) {
      throw new BadRequestException('La subasta ya ha finalizado.');
    }
  
    // Si ya existe una puja del mismo usuario, la actualiza
    const existingBid = puja.pujas.find((bid) => bid.user.email === userId);
  
    if (existingBid) {
      existingBid.amount = bidAmount; // Actualiza la puja
    } else {
      // Si no existe, crea una nueva puja
      const newPujaBid = new PujaBid();
      newPujaBid.user = user;
      newPujaBid.amount = bidAmount;
      puja.pujas.push(newPujaBid);
    }
  
    return this.pujaRepository.save(puja);  // Guarda la subasta con las pujas actualizadas
  }
}  
