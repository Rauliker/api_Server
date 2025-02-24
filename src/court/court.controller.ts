import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CreateCourtDto, UpdateCourtDto } from './court.dto';
import { CourtService } from './court.service';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post()
  async create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtService.create(createCourtDto);
  }

  @Get()
  async findAll() {
    return this.courtService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const court = await this.courtService.findOne(id);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCourtDto: UpdateCourtDto) {
    const court = await this.courtService.update(id, updateCourtDto);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const court = await this.courtService.remove(id);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }
}
