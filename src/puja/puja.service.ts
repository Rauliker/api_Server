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
    const { creatorId, imagenes: imagenesUrls, ...pujaData } = createPujaDto;
  
    // Verificar que el creador existe
    const creator = await this.userRepository.findOne({ where: { email: creatorId } });
    if (!creator) {
      throw new NotFoundException('Creador no encontrado.');
    }
  
    // Crear la instancia de la puja
    const puja = this.pujaRepository.create({
      ...pujaData,
      creator, // Asociar el creador
    });
  
    // Guardar la puja para obtener el ID
    const savedPuja = await this.pujaRepository.save(puja);
  
    // Asociar las imágenes a la puja
    const imagenes = imagenesUrls.map((url) => {
      const imagen = new Image(); // Asegúrate de tener la entidad `Image`
      imagen.url = url;
      imagen.puja = savedPuja; // Establecer la relación
      return imagen;
    });
  
    // Guardar las imágenes
    await this.imagenRepository.save(imagenes);
  
    return savedPuja;
  }
  
  

  async findAll(): Promise<any[]> {
    const pujas = await this.pujaRepository.find({
      relations: ['creator', 'imagenes'],
    });
  
    // Agregar los bids a cada puja
    const pujasWithBids = await Promise.all(
      pujas.map(async (puja) => {
        const bids = await this.getBidsByPuja(puja.id);
        return { ...puja, bids };
      }),
    );
  
    return pujasWithBids;
  }
  

  async findOne(id: number): Promise<any> {
    const puja = await this.pujaRepository.findOne({
      where: { id },
      relations: ['creator', 'imagenes'],
    });
  
    if (!puja) {
      throw new NotFoundException('Puja no encontrada.');
    }
  
    // Obtener los bids asociados
    const bids = await this.getBidsByPuja(id);
  
    return { ...puja, bids };
  }
  
  async getBidsByPuja(pujaId: number): Promise<PujaBid[]> {
  const pujaBids = await this.pujaBidRepository.find({
    where: { puja: { id: pujaId } },
    relations: ['puja', 'user'], // Agregar relaciones necesarias
  });

  if (pujaBids.length === 0) {
    throw new NotFoundException('No se encontraron bids para esta puja.');
  }

  return pujaBids;
  }

  async getBidsByUser(userEmail: string): Promise<PujaBid[]> {
    const pujaBids = await this.pujaBidRepository.find({
      where: { user: { email: userEmail } },
      relations: ['puja', 'user'], // Agregar relaciones necesarias
    });
  
    if (pujaBids.length === 0) {
      throw new NotFoundException('No se encontraron bids para esta puja.');
    }
  
    return pujaBids;
  }

  
  async makeBid(makeBidDto: MakeBidDto): Promise<PujaBid> {
    const { userId, pujaId, bidAmount } = makeBidDto;
  
    // Verificar que la puja existe
    const puja = await this.pujaRepository.findOne({
      where: { id: pujaId },
      relations: ['creator'],
    });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada');
    }
  
    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { email: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    // Verificar que el creador de la puja no sea el usuario
    if (puja.creator.email === userId) {
      throw new NotFoundException('El creador de la puja no puede realizar una puja.');
    }
  
    // Verificar que la fecha límite de la puja no haya expirado
    const currentDate = new Date();
    if (currentDate > puja.fechaFin) {
      throw new NotFoundException('La fecha límite para esta puja ha expirado.');
    }
    if(puja.pujaActual>=bidAmount){
      throw new NotFoundException('El monto de la puja debe ser mayor al monto anterior.');
    }
  
    // Verificar si el usuario ya realizó una puja para esta subasta
    const existingBid = await this.pujaBidRepository
      .createQueryBuilder('puja_bids')
      .innerJoin('users', 'users', 'puja_bids.userEmail = users.email')
      .innerJoin('puja', 'puja', 'puja_bids.pujaId = puja.id')
      .where('users.email = "'+userId+'"')
      .andWhere('puja.id = ' +pujaId+'')
      .select('puja_bids.*')
      .getRawOne();

    // Verificar si el usuario ya realizó una puja
    if (existingBid) {
      
      const updatedBid = this.pujaBidRepository.merge({
        id:existingBid.id,
        user,
        puja,
        amount: bidAmount,
      });
      // Guardar la puja actualizada en la base de datos
      return await this.pujaBidRepository.save(updatedBid);
    } else {
      // Si el usuario no ha realizado una puja, creamos una nueva
      const newBid = this.pujaBidRepository.create({ user, puja, amount: bidAmount });
      await this.pujaRepository.update(
        { id: puja.id }, // Criterio para encontrar el registro
        { pujaActual: bidAmount } // Campos que deseas actualizar
      );
      
      return await this.pujaBidRepository.save(newBid);
    }
    
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
