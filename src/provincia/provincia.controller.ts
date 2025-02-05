import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProvinciaDto } from './provincia.dto';
import { ProvinciaService } from './provincia.service';

@ApiTags('Provincias') 
@Controller('provincias')
export class ProvinciaController {
  constructor(private readonly provinciaService: ProvinciaService) {}

  @Post()
  @ApiOperation({ summary: 'Create provincia' })
  @ApiResponse({ status: 201, description: 'Provincia creada correctamente.', type: CreateProvinciaDto })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  createProvincia(@Body() createProvinciaDto: CreateProvinciaDto[]) {
    return this.provinciaService.createProvincia(createProvinciaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all provincias' })
  @ApiResponse({ status: 200, description: 'Lista de provincias.', type: [CreateProvinciaDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron provincias.' })
  findAllProvincias() {
    return this.provinciaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one provincia by id' })
  @ApiResponse({ status: 200, description: 'Provincia encontrada.', type: CreateProvinciaDto })
  @ApiResponse({ status: 404, description: 'Provincia no encontrada.' })
  findOneProvincia(@Param('id') id: number) {
    return this.provinciaService.findOne(id);
  }
}
