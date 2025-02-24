import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourtTypeDto, UpdateCourtTypeDto } from './courtType.dto';
import { CourtType } from './courtType.entity';

@Injectable()
export class CourtTypeService {
  constructor(
    @InjectRepository(CourtType)
    private typeRepository: Repository<CourtType>,
  ) {}

  async create(createCourtTypeDto: CreateCourtTypeDto) {
    const type = this.typeRepository.create({
      name: createCourtTypeDto.name,
    });
    return this.typeRepository.save(type);
  }

  async findAll() {
    return this.typeRepository.find();
  }

  async findOne(id: number) {
    const type = await this.typeRepository.findOneBy({ id });
    if (!type) {
      throw new NotFoundException('Court type not found');
    }
    return type;
  }

  async update(id: number, updateCourtTypeDto: UpdateCourtTypeDto) {
    const type = await this.findOne(id);
    type.name = updateCourtTypeDto.name;
    return this.typeRepository.save(type);
  }

  async remove(id: number) {
    const type = await this.findOne(id);
    await this.typeRepository.remove(type);
    return type;
  }
}
