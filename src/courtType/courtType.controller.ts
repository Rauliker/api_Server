import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCourtTypeDto, UpdateCourtTypeDto } from './courtType.dto';
import { CourtTypeService } from './courtType.service';

@Controller('court-type')
export class CourtTypeController {
  constructor(private readonly courtTypeService: CourtTypeService) {}

  @Post()
  async create(@Body() createCourtTypeDto: CreateCourtTypeDto) {
    return this.courtTypeService.create(createCourtTypeDto);
  }

  @Get()
  async findAll() {
    return this.courtTypeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.courtTypeService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCourtTypeDto: UpdateCourtTypeDto,
  ) {
    return this.courtTypeService.update(id, updateCourtTypeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.courtTypeService.remove(id);
  }
}
