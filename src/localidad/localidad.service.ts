import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provincia } from 'src/provincia/provinvia.entity';
import { Repository } from 'typeorm';
import { CreateLocalidadDto } from './localidad.dto';
import { Localidad } from './localidad.entity';

@Injectable()
export class LocalidadService {
    constructor(
      @InjectRepository(Localidad)
      private readonly localidadRepository: Repository<Localidad>,
      
      @InjectRepository(Provincia)
      private readonly provinciaRepository: Repository<Provincia>,
    ) {}
  async createLocalidad(createLocalidadDto: CreateLocalidadDto): Promise<Localidad> {
    // Primero, obtener la provincia por su ID
    const provincia = await this.provinciaRepository.findOne({
      where: { id_provincia: createLocalidadDto.provinciaId },
    });

    if (!provincia) {
      throw new Error('Provincia no encontrada');
    }

    // Crear la localidad y asignar la provincia
    const localidad = this.localidadRepository.create({
      nombre: createLocalidadDto.nombre,
      provincia,  // Asignamos la provincia encontrada
    });

    // Guardar la localidad en la base de datos
    return this.localidadRepository.save(localidad);
  }


  // Obtener todas las localidades con su provincia
  async findAll() {
    return this.localidadRepository.find({ relations: ['provincia'] });
  }

  // Obtener una localidad por su ID con la provincia a la que pertenece
  async findOne(id_localidad: number) {
    return this.localidadRepository.findOne({
      where: { id_localidad },
      relations: ['provincia'],
    });
  }
}