import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateCourtDto, UpdateCourtDto } from './court.dto';
import { CourtService } from './court.service';

@Controller('court')
export class CourtController {
  constructor(private readonly courtService: CourtService) {}

  @Post()
  async create(@Body() createCourtDto: CreateCourtDto) {
    return this.courtService.create(createCourtDto);
  }

  @Get()
  async findAll(@Query('type') type: number) {
    return this.courtService.findAll(type);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const court = await this.courtService.findOne(id);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async addImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    const court = await this.courtService.addImage(id, file);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateCourtDto: UpdateCourtDto) {
    const court = await this.courtService.update(id, updateCourtDto);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const court = await this.courtService.remove(id);
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }
}
