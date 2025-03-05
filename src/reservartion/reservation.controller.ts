import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from '../utils/file.utils';
import { CreateReservationDto } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reserve')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createReservationDto: CreateReservationDto) {
    const imageName = `${file.originalname.split('.')[0]}_${new Date().toISOString().split('T')[0]}.${file.originalname.split('.').pop()}`;
    const imagePath = `images/${imageName}`;
    
    await saveFile(file, imagePath);
    
    return this.reservationService.create({ ...createReservationDto, imageLink: imagePath });
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reservationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateReservationDto: CreateReservationDto) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reservationService.remove(id);
  }
}
