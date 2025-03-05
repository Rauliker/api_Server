import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateVenueDto } from './venue.dto';
import { VenueService } from './venue.service';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  create(@Body() createVenueDto: CreateVenueDto) {
    return this.venueService.create(createVenueDto);
  }

  @Get()
  findAll() {
    return this.venueService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.venueService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateVenueDto: CreateVenueDto) {
    return this.venueService.update(id, updateVenueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.venueService.remove(id);
  }
}
