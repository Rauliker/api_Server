import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourtStatus } from '../courtStatus/courtStatus.entity';
import { CourtType } from '../courtType/courtType.entity';
import { CreateCourtDto, UpdateCourtDto } from './court.dto';
import { Court } from './court.entity';

@Injectable()
export class CourtService {
  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(CourtType)
    private typeRepository: Repository<CourtType>,
    @InjectRepository(CourtStatus)
    private statusRepository: Repository<CourtStatus>,
  ) {}

  async create(createCourtDto: CreateCourtDto) {
    const type = await this.typeRepository.findOneBy({ id: createCourtDto.typeId });
    if (!type) {
      throw new NotFoundException('Court type not found');
    }

    const status = await this.statusRepository.findOneBy({ id: createCourtDto.statusId });
    if (!status) {
      throw new NotFoundException('Court status not found');
    }

    const court = this.courtRepository.create({
      name: createCourtDto.name,
      type,
      status,
    });

    return this.courtRepository.save(court);
  }

  async findAll() {
    return this.courtRepository.find({
      relations: ['type', 'status'],
    });
  }

  async findOne(id: number) {
    const court = await this.courtRepository.findOne({
      where: { id },
      relations: ['type', 'status'],
    });
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }

  async update(id: number, updateCourtDto: UpdateCourtDto) {
    const court = await this.findOne(id);

    if (updateCourtDto.typeId) {
      const type = await this.typeRepository.findOneBy({ id: updateCourtDto.typeId });
      if (!type) {
        throw new NotFoundException('Court type not found');
      }
      court.type = type;
    }

    if (updateCourtDto.statusId) {
      const status = await this.statusRepository.findOneBy({ id: updateCourtDto.statusId });
      if (!status) {
        throw new NotFoundException('Court status not found');
      }
      court.status = status;
    }

    if (updateCourtDto.name) {
      court.name = updateCourtDto.name;
    }

    return this.courtRepository.save(court);
  }

  async remove(id: number) {
    const court = await this.findOne(id);
    await this.courtRepository.remove(court);
    return court;
  }
}
