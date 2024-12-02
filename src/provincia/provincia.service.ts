import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProvinciaDto } from './provincia.dto';
import { Provincia } from './provinvia.entity';

@Injectable()
export class ProvinciaService {
  constructor(
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
  ) {}

  // Obtener todas las provincias con sus localidades
  async findAll() {
    return this.provinciaRepository.find({ relations: ['localidades'] });
  }

  // Obtener una provincia por su ID con sus localidades
  async findOne(id_provincia: number) {
    return this.provinciaRepository.findOne({
      where: { id_provincia },
      relations: ['localidades'],
    });
  }
  async createProvincia(createProvinciaDto: CreateProvinciaDto): Promise<Provincia> {
    const provincia = this.provinciaRepository.create(createProvinciaDto);
    return this.provinciaRepository.save(provincia);
  }
}
