import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatePujaDto, MakeBidDto, UpdatePujaDto } from './subastas.dto';
import { PujaService } from './subastas.service';

@Controller('pujas')
export class PujaController {
  constructor(private readonly pujaService: PujaService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 5, {
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
    console.log(files); // Aquí tienes el archivo subido
    console.log(createPujaDto);
    // Generamos las URLs de las imágenes y las pasamos al servicio
    const imagenesUrls = files.map(file => `/images/${file.filename}`);
    return this.pujaService.createPuja({ ...createPujaDto, imagenes: imagenesUrls });
  }

  @Get()
  async findAllPujas(
    @Query('search') search?: string,
    @Query('open') open?: boolean, 
    @Query('min') min?: number, 
    @Query('max') max?: number,
    @Query('date') date?: string, 

  ) {
    try {
      return this.pujaService.findAll(search,open,min,max,date);
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
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './images', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const filename = file.originalname; 
          callback(null, filename); // Usar un nombre único
        },
      }),
    }),
  )
  async updatePuja(
    @Param('id') id: number,
    @Body() updatePujaDto: UpdatePujaDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    // Mapear las URLs de las imágenes
    const imagenesUrls = files.map(file => `/images/${file.filename}`);
  
    // Llamar al servicio para actualizar la puja
    return this.pujaService.updatePuja(id, {
      ...updatePujaDto,
      imagenes: imagenesUrls,
    });
  }
  @Delete(':id/eliminar-imagenes')
  async deleteImagePuja(
    @Param('id') id: number,
    @Body() updatePujaDto: UpdatePujaDto,
  ) {
    // Llamar al servicio para eliminar las imágenes de la puja
    return this.pujaService.deletePujaImages(id, updatePujaDto.eliminatedImages);
  }


  @Get(':id')
  findOnePuja(@Param('id') id: number) {
    return this.pujaService.findOne(id);
  }
  @Get('other/:id') 
  findOtherPuja(@Param('id') id: string,
  @Query('search') search?: string,
  @Query('open') open?: boolean, 
  @Query('min') min?: number, 
  @Query('max') max?: number,
  @Query('date') date?: string, ) {
    return this.pujaService.getPujaByOtherUser(id,search,open,min,max,date);
  }
  @Get('my/:id') 
  findMyPuja(@Param('id') id: string,
  @Query('search') search?: string,
  @Query('open') open?: boolean, 
  @Query('min') min?: number, 
  @Query('max') max?: number,
  @Query('date') date?: string) {
    return this.pujaService.getPujasByUser(id,search,open,min,max,date);
  }
  @Post('bid')
  makeBid(@Body() makeBidDto: MakeBidDto) {
    return this.pujaService.makeBid(makeBidDto);
  }
  @Get('bid/:id')
  getBid(@Param('id') id: number) {
    return this.pujaService.getBidsByPuja(id);
  }
  @Get('users/:email')
  getusersBid(@Param('email') email: string) {
    return this.pujaService.getBidsByUser(email);
  }
  @Delete(':id')
  deletePuja(@Param('id') id: number) {
    return this.pujaService.deletePuja(id);
  }
  @Get('pay/:id')
  pagar(@Param('id') id: number) {
    return this.pujaService.pay(id);
  }
  @Get('win/:id')
  ganador(@Param('id') id: number) {
    return this.pujaService.win(id);
  }
}
