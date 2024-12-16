import { Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatePujaDto, MakeBidDto } from './subastas.dto';
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
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename); // Usar un nombre único con timestamp
        },
      }),
    }),
  )
  async createPuja(@Body() createPujaDto: CreatePujaDto, @UploadedFiles() files: Express.Multer.File[]) {
    console.log(files); // Aquí tienes el archivo subido
    console.log(createPujaDto);
    // Generamos las URLs de las imágenes y las pasamos al servicio
    const imagenesUrls = files.map(file => `http://localhost:3000/images/${file.filename}`);
    return this.pujaService.createPuja({ ...createPujaDto, imagenes: imagenesUrls });
  }

  @Get()
  findAllPujas() {
    return this.pujaService.findAll();
  }

  @Get(':id')
  findOnePuja(@Param('id') id: number) {
    return this.pujaService.findOne(id);
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
}
