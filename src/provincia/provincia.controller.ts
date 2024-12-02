import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProvinciaDto } from './provincia.dto';
import { ProvinciaService } from './provincia.service';
@Controller('provincias')
export class ProvinciaController {
  constructor(private readonly provinciaService: ProvinciaService) {}

  @Post()
  createProvincia(@Body() createProvinciaDto: CreateProvinciaDto) {
    return this.provinciaService.createProvincia(createProvinciaDto);
  }

  @Get()
  findAllProvincias() {
    return this.provinciaService.findAll();
  }

  @Get(':id')
  findOneProvincia(@Param('id') id: number) {
    return this.provinciaService.findOne(id);
  }
}
