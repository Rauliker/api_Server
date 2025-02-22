import { Injectable } from '@nestjs/common';
import { CreateCourtDto } from './court.dto';

@Injectable()
export class CourtService {
  private courts = [];

  create(createCourtDto: CreateCourtDto) {
    this.courts.push(createCourtDto);
    return createCourtDto;
  }

  findAll() {
    return this.courts;
  }
}
