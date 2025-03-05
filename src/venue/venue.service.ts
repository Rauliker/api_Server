import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVenueDto } from './venue.dto';
import { Venue } from './venue.entity';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
  ) {}

  create(createVenueDto: CreateVenueDto) {
    const venue = this.venueRepository.create(createVenueDto);
    return this.venueRepository.save(venue);
  }

  findAll() {
    return this.venueRepository.find();
  }

  findOne(id: number) {
    return this.venueRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateVenueDto: CreateVenueDto) {
    return this.venueRepository.update(id, updateVenueDto);
  }

  remove(id: number) {
    return this.venueRepository.delete(id);
  }
}
