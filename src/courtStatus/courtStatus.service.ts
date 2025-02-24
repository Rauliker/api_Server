import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourtStatusDto, UpdateCourtStatusDto } from './courtStatus.dto';
import { CourtStatus } from './courtStatus.entity';

@Injectable()
export class CourtStatusService {
  constructor(
    @InjectRepository(CourtStatus)
    private statusRepository: Repository<CourtStatus>,
  ) {}

  async create(createCourtStatusDto: CreateCourtStatusDto) {
    const status = this.statusRepository.create({
      name: createCourtStatusDto.name,
    });
    return this.statusRepository.save(status);
  }

  async findAll() {
    return this.statusRepository.find();
  }

  async findOne(id: number) {
    const status = await this.statusRepository.findOneBy({ id });
    if (!status) {
      throw new NotFoundException('Court status not found');
    }
    return status;
  }

  async update(id: number, updateCourtStatusDto: UpdateCourtStatusDto) {
    const status = await this.findOne(id);
    status.name = updateCourtStatusDto.name;
    return this.statusRepository.save(status);
  }

  async remove(id: number) {
    const status = await this.findOne(id);
    await this.statusRepository.remove(status);
    return status;
  }
}
