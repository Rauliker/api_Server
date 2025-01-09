import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Image } from 'src/imagen/imagen.entity';
import { User } from 'src/users/users.entity';
import { Not, Repository } from 'typeorm';
import { PujaBid } from './pujaBid.entity';
import { CreatePujaDto, MakeBidDto, UpdatePujaDto } from './subastas.dto';
import { Puja } from './subastas.entity';


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
  
  private readonly logger = new Logger(PujaService.name);

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
      const imagen = new Image();
      imagen.url = url;
      imagen.puja = savedPuja;
      return imagen;
    });
  
    // Guardar las imágenes
    await this.imagenRepository.save(imagenes);
  
    return savedPuja;
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
  async deletePuja(id: number): Promise<string> {
    const puja = await this.pujaRepository.findOne({ where: { id }, relations: ['pujas','imagenes'] });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada');
    }

    await this.pujaRepository.remove(puja);
    
    if (puja.imagenes) {
        for (const imagen of puja.imagenes) {
            const filePath = `.${imagen.url}`; 
            
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
        
      }

    return `Subasta con ID ${id} y sus pujas relacionadas fueron eliminadas`;
  }

  async getPujaByOtherUser(userEmail: string): Promise<any[]> {
    const pujas = await this.pujaRepository.find({
        where: { creator: { email: Not(userEmail) } },
        relations: ['creator', 'pujas','imagenes'], // Asegúrate de incluir las relaciones necesarias
    });

    if (pujas.length === 0) {
        throw new NotFoundException('No se encontraron pujas de otros usuarios.');
        
    }else{
      const pujasWithPujaActual = await Promise.all(
        pujas.map(async (puja) => {
          const pujaActual = await this.getPujaActual(puja.id, puja.pujaInicial);
          return { ...puja, pujaActual };
        }),
      );
  
      return pujasWithPujaActual;
    }
  }
  async getPujasByUser(userEmail: string): Promise<Puja[]> {
    const pujas = await this.pujaRepository.find({
        where: { creator: { email: (userEmail) } },
        relations: ['creator', 'imagenes'], 
    });

    if (pujas.length === 0) {
        throw new NotFoundException('No se encontraron subastas del usuario de otros usuarios.');
    }else{
      const pujasWithPujaActual = await Promise.all(
        pujas.map(async (puja) => {
          const pujaActual = await this.getPujaActual(puja.id, puja.pujaInicial);
          return { ...puja, pujaActual };
        }),
      );
  
      return pujasWithPujaActual;
    }
  }
  private async getPujaActual(pujaId: number, pujaInicial: number): Promise<number> {
    const maxBid = await this.pujaBidRepository
        .createQueryBuilder('puja_bids')
        .innerJoin('users', 'users', 'puja_bids.userEmail = users.email')
        .where('puja_bids.pujaId = :pujaId', { pujaId })
        .andWhere('users.banned = false')
        .select('MAX(puja_bids.amount)', 'max')
        .getRawOne();

    // Asegúrate de que el valor devuelto sea un número de tipo double
    return maxBid?.max ? parseFloat(maxBid.max) : parseFloat(pujaInicial.toString());
}

  async findAll(): Promise<any[]> {
    const pujas = await this.pujaRepository.find({
      relations: ['creator', 'imagenes','pujas'],
    });

    const pujasWithPujaActual = await Promise.all(
      pujas.map(async (puja) => {
        const pujaActual = await this.getPujaActual(puja.id, puja.pujaInicial);
        return { ...puja, pujaActual };
      }),
    );

    return pujasWithPujaActual;
  }

  async findOne(id: number): Promise<any> {
    const puja = await this.pujaRepository.findOne({
      where: { id },
      relations: ['creator', 'imagenes', 'pujas'],
    });

    if (!puja) {
      throw new NotFoundException('Puja no encontrada.');
    }

    const pujaActual = await this.getPujaActual(puja.id, puja.pujaInicial);
    return { ...puja, pujaActual };
  }

  async findOneUsers(id: number): Promise<any> {
    const puja = await this.pujaRepository.findOne({
      where: { id },
      relations: ['creator', 'imagenes'],
    });

    if (!puja) {
      throw new NotFoundException('Puja no encontrada.');
    }

    const bids = await this.getBidsByPuja(id);
    const pujaActual = await this.getPujaActual(puja.id, puja.pujaInicial);

    return { ...puja, bids, pujaActual };
  }

  async updatePuja(id: number, updatePujaDto: UpdatePujaDto) {
    const puja = await this.findOne(id); // Encuentra la puja existente

    if (!puja) {
      throw new Error('Puja no encontrada');
    }
    // Actualiza la puja

    // Actualiza la puja con los nuevos datos
    const updatedPuja = this.pujaRepository.merge(puja, updatePujaDto);
    await this.pujaRepository.save(updatedPuja);
    return updatedPuja;
  }

  async makeBid(makeBidDto: MakeBidDto): Promise<PujaBid> {
    const { userId, pujaId, bidAmount, email_user, iswinner } = makeBidDto;

    const puja = await this.pujaRepository.findOne({
      where: { id: pujaId },
      relations: ['creator'],
    });
    if (!puja) {
      throw new NotFoundException('Puja no encontrada');
    }

    const user = await this.userRepository.findOne({ where: { email: userId, banned:false } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado o esta baneado');
    }
    if (puja.creator.email === userId) {
      throw new NotFoundException('El creador de la puja no puede realizar una puja.');
    }

    const currentDate = new Date();
    if (currentDate > puja.fechaFin) {
      throw new NotFoundException('La fecha límite para esta puja ha expirado.');
    }

    const pujaActual = await this.getPujaActual(puja.id, puja.pujaInicial);
    if (bidAmount <= pujaActual) {
      throw new NotFoundException('El monto de la puja debe ser mayor al monto actual.');
    }

    
    const result = await this.userRepository.findOne({
      where: { email: email_user },
      select: ['balance'],
      });

  const remainingBalance = result.balance - bidAmount;
    
  this.logger.debug(result.balance);
  if (remainingBalance < pujaActual) {
    throw new NotFoundException('El saldo es insuficiente');
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
        id: existingBid.id,
        user,
        puja,
        iswinner,
        amount: bidAmount,
        email_user: email_user
      });
      // Guardar la puja actualizada en la base de datos
      return await this.pujaBidRepository.save(updatedBid);
    } else {
      // Si el usuario no ha realizado una puja, creamos una nueva
      const newBid = this.pujaBidRepository.create({ user, puja, amount: bidAmount, email_user});
      return await this.pujaBidRepository.save(newBid);
    }
  }

  async getBidsByPuja(pujaId: number): Promise<PujaBid[]> {
    return this.pujaBidRepository.find({
      where: { puja: { id: pujaId } },
      relations: ['puja', 'user'],
    });
  }

  async pay(pujaId: number): Promise<string> {
    // Obtener la puja
    const puja = await this.pujaRepository.findOne({
        where: { id: pujaId },
        relations: ['creator'], // Asegúrate de que se cargue el creador
    });

    if (!puja) {
        throw new NotFoundException('Puja no encontrada');
    }

    // Obtener la puja actual (la más alta)
    const highestBid = await this.pujaBidRepository
        .createQueryBuilder('bid')
        .where('bid.pujaId = :pujaId', { pujaId })
        .orderBy('bid.amount', 'DESC')
        .getOne();

    if (!highestBid) {
        throw new NotFoundException('No hay pujas para esta subasta.');
    }

    // Obtener el creador de la puja
    let email = puja.creator.email;
    if (!email) {
        throw new NotFoundException('El creador no tiene un email válido.');
    }


    const creator = await this.userRepository.findOne({ where: { email } });
    if (!creator) {
        throw new NotFoundException('El creador no fue encontrado.');
    }
    
    email = highestBid.email_user;
    const bidder = await this.userRepository.findOne({ where: { email } });
    if (!bidder) {
        throw new NotFoundException('El postor no fue encontrado.');
    }

    const currentBalance = Number(creator.balance || 0);
    const bidAmount = Number(highestBid.amount);
    let balance = currentBalance + bidAmount;
    
    const updatedCreator = this.userRepository.merge(creator, { balance });

    // Actualizar el balance del creador en la base de datos
    await this.userRepository.save(updatedCreator);
    const currentBidder = Number(bidder.balance || 0);
    
    balance = currentBidder - bidAmount;
    const updatedBidder = this.userRepository.merge(bidder, { balance });

    // Actualizar el balance del creador en la base de datos
    await this.userRepository.save(updatedBidder);

    return `Se ha añadido ${highestBid.amount} al balance del creador ${creator.email}.`;
}


  @Cron('59 * * * * *')
  async handleCron() {
    let mesage="Las Subastas que han finalizado son: ";
    const resultados = await this.pujaRepository
      .createQueryBuilder('puja')
      .select('puja.id', 'id')
      .where('DATE(puja.fechaFin) <= DATE(NOW())')
      .andWhere('puja.open=true')
      .getRawMany();
    if (resultados.length === 0) {
      this.logger.debug('No hay subastas finalizadas.');
      return [];
    }else{
    for (const resultado of resultados) {
      mesage+=resultado.id;
      const puja = await this.findOne(resultado.id); 
      const updatedPuja = this.pujaRepository.merge(puja, {"open": false});
          await this.pujaRepository.save(updatedPuja);
          this.pay(resultado.id);
      }
    return resultados.map((resultado) => resultado.id);
    }
  }
}  
