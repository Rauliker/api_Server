import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { NotificationService } from 'src/notification/notification.service';
import { CreatePujaDto, MakeBidDto, UpdatePujaDto } from './subastas.dto';
import { PujaService } from './subastas.service';

@ApiTags('Pujas') // Etiqueta para agrupar las rutas en Swagger
@Controller('pujas')
export class PujaController {
  constructor(private readonly pujaService: PujaService, private readonly notificationService: NotificationService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear una nueva puja' })
  @ApiBody({ type: CreatePujaDto })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './images', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const filename = file.originalname;
          callback(null, filename); // Usar un nombre único
        },
      }),
    }),
  )
  async createPuja(@Body() createPujaDto: CreatePujaDto, @UploadedFiles() files: Express.Multer.File[]) {
    // Validar si se han subido archivos
    if (!files || files.length === 0) {
      throw new HttpException('No se ha subido ninguna imagen. La imagen es obligatoria.', HttpStatus.BAD_REQUEST);
    }

    const imagenesUrls = files.map(file => `/images/${file.filename}`);
    
    // Intentar crear la puja
    try {
      const puja = await this.pujaService.createPuja({ ...createPujaDto, imagenes: imagenesUrls });
      return puja;
    } catch (error) {
      // Eliminar las imágenes si ocurre un error
      files.forEach(file => {
        const filePath = path.join('./images', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);  // Eliminar el archivo subido
        }
      });
      throw new HttpException('Error al crear la puja, se ha eliminado la imagen.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get()
  @ApiOperation({ summary: 'Obtener todas las pujas' })
  @ApiQuery({ name: 'type', required: false, enum: ['my', 'other'], description: 'Tipo de puja' })
  @ApiQuery({ name: 'email', required: false, description: 'Correo del usuario' })
  @ApiQuery({ name: 'search', required: false, description: 'Texto de búsqueda' })
  @ApiQuery({ name: 'open', required: false, description: 'Estado de apertura' })
  @ApiQuery({ name: 'min', required: false, description: 'Valor mínimo de la puja' })
  @ApiQuery({ name: 'max', required: false, description: 'Valor máximo de la puja' })
  @ApiQuery({ name: 'date', required: false, description: 'Fecha de la puja' })
  async findAllPujas(
    @Query('type') type?: 'my' | 'other',
    @Query('email') email?: string,
    @Query('search') search?: string,
    @Query('open') open?: string,
    @Query('min') min?: number,
    @Query('max') max?: number,
    @Query('date') date?: string,
  ) {
    try {
      return this.pujaService.findAll(type, email, search, open, min, max, date);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar una puja existente' })
  @ApiParam({ name: 'id', description: 'ID de la puja a actualizar' })
  @ApiBody({ type: UpdatePujaDto })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const filename = file.originalname;
          callback(null, filename);
        },
      }),
    }),
  )
  async updatePuja(
    @Param('id') id: number,
    @Body() updatePujaDto: UpdatePujaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imagenesUrls = files.map(file => `/images/${file.filename}`);
    return this.pujaService.updatePuja(id, { ...updatePujaDto, imagenes: imagenesUrls });
  }

  @Delete(':id/eliminar-imagenes')
  @ApiOperation({ summary: 'Eliminar imágenes de una puja' })
  @ApiParam({ name: 'id', description: 'ID de la puja de la cual eliminar imágenes' })
  async deleteImagePuja(@Param('id') id: number, @Body() updatePujaDto: UpdatePujaDto) {
    return this.pujaService.deletePujaImages(id, updatePujaDto.eliminatedImages);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una puja por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la puja a obtener' })
  findOnePuja(@Param('id') id: number) {
    return this.pujaService.findOne(id);
  }

  @Post('bid')
  @ApiOperation({ summary: 'Realizar una puja' })
  @ApiBody({ type: MakeBidDto })
  makeBid(@Body() makeBidDto: MakeBidDto) {
    return this.pujaService.makeBid(makeBidDto);
  }

  @Get('bid/:id')
  @ApiOperation({ summary: 'Obtener pujas de una puja específica' })
  @ApiParam({ name: 'id', description: 'ID de la puja' })
  getBid(@Param('id') id: number) {
    return this.pujaService.getBidsByPuja(id);
  }

  @Get('users/:email')
  @ApiOperation({ summary: 'Obtener pujas realizadas por un usuario' })
  @ApiParam({ name: 'email', description: 'Correo electrónico del usuario' })
  getusersBid(@Param('email') email: string) {
    return this.pujaService.getBidsByUser(email);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una puja' })
  @ApiParam({ name: 'id', description: 'ID de la puja a eliminar' })
  deletePuja(@Param('id') id: number) {
    return this.pujaService.deletePuja(id);
  }

  @Get('win/:id')
  @ApiOperation({ summary: 'Procesar la puja ganadora' })
  @ApiParam({ name: 'id', description: 'ID de la puja ganadora' })
  pagar(@Param('id') id: number) {
    return this.pujaService.processWinningBid(id);
  }

  @Get('notification/:id')
  @ApiOperation({ summary: 'Enviar notificación' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  not(@Param('id') id: string) {
    return this.notificationService.sendNotification(id, 'prueba', 'prueba');
  }
}
