import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from '../utils/file.utils';
import { CreateVenueDto } from './venue.dto';
import { VenueService } from './venue.service';

@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createVenueDto: CreateVenueDto) {
    const imageName = `${file.originalname.split('.')[0]}_${new Date().toISOString().split('T')[0]}.${file.originalname.split('.').pop()}`;
    const imagePath = `images/${imageName}`;
    
    await saveFile(file, imagePath);
    
    return this.venueService.create({ ...createVenueDto, image: imagePath });
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
