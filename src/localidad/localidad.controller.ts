import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLocalidadDto } from './localidad.dto';
import { LocalidadService } from './localidad.service';

@Controller('localidades')
export class LocalidadController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Post()
  createLocalidad(@Body() createLocalidadDto: CreateLocalidadDto[]) {
    return this.localidadService.createMultipleLocalidades(createLocalidadDto);
  }

  @Get()
  findAllLocalidades() {
    return this.localidadService.findAll();
  }

  @Get(':id')
  findOneLocalidad(@Param('id') id: number) {
    return this.localidadService.findOne(id);
  }
}
