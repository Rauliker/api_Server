import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLocalidadDto } from './localidad.dto';
import { LocalidadService } from './localidad.service';

@ApiTags('Localidades')  // Agrupa las rutas en Swagger bajo 'Localidades'
@Controller('localidades')
export class LocalidadController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Post()
  @ApiOperation({ summary: 'Create multiple localidades' })
  @ApiResponse({ status: 201, description: 'Localidades creadas correctamente.', type: [CreateLocalidadDto] })
  @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
  createLocalidad(@Body() createLocalidadDto: CreateLocalidadDto[]) {
    return this.localidadService.createMultipleLocalidades(createLocalidadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all localidades' })
  @ApiResponse({ status: 200, description: 'Lista de localidades', type: [CreateLocalidadDto] })
  @ApiResponse({ status: 404, description: 'No se encontraron localidades.' })
  findAllLocalidades() {
    return this.localidadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find one localidad by id' })
  @ApiResponse({ status: 200, description: 'Localidad encontrada.', type: CreateLocalidadDto })
  @ApiResponse({ status: 404, description: 'Localidad no encontrada.' })
  findOneLocalidad(@Param('id') id: number) {
    return this.localidadService.findOne(id);
  }
}
