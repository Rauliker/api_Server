import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatePujaDto, MakeBidDto } from './puja.dto';
import { PujaService } from './puja.service';
@Controller('pujas')
export class PujaController {
  constructor(private readonly pujaService: PujaService) {}

  @Post()
  createPuja(@Body() createPujaDto: CreatePujaDto) {
    return this.pujaService.createPuja(createPujaDto);
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
}
