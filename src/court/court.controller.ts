import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateCourtDto } from './court.dto';
import { CourtService } from './court.service';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post()
  create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtService.create(createCourtDto);
  }

  @Get()
  findAll() {
    return this.courtService.findAll();
  }
}
