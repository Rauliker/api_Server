import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateCourtStatusDto, UpdateCourtStatusDto } from './courtStatus.dto';
import { CourtStatusService } from './courtStatus.service';

@Controller('court-status')
export class CourtStatusController {
  constructor(private readonly courtStatusService: CourtStatusService) {}

  @Post()
  async create(@Body() createCourtStatusDto: CreateCourtStatusDto) {
    return this.courtStatusService.create(createCourtStatusDto);
  }

  @Get()
  async findAll() {
    return this.courtStatusService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.courtStatusService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCourtStatusDto: UpdateCourtStatusDto,
  ) {
    return this.courtStatusService.update(id, updateCourtStatusDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.courtStatusService.remove(id);
  }
}
