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

  // Método para crear varias localidades
  async createMultipleLocalidades(createLocalidadDtos: CreateLocalidadDto[]): Promise<Localidad[]> {
    const localidades: Localidad[] = [];

    for (const createLocalidadDto of createLocalidadDtos) {
      // Obtener la provincia por su ID
      const provincia = await this.provinciaRepository.findOne({
        where: { id_provincia: createLocalidadDto.provinciaId },
      });

      if (!provincia) {
        throw new Error(`Provincia con ID ${createLocalidadDto.provinciaId} no encontrada`);
      }

      // Crear la localidad y asignar la provincia
      const localidad = this.localidadRepository.create({
        nombre: createLocalidadDto.nombre,
        provincia,  // Asignamos la provincia encontrada
      });

      localidades.push(localidad); // Añadir la localidad al array
    }

    // Guardar todas las localidades en la base de datos
    return this.localidadRepository.save(localidades);
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
