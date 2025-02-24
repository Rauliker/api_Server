import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateReservationStatusDto, UpdateReservationStatusDto } from './reservationStatus.dto';
import { ReservationStatusService } from './reservationStatus.service';

@Controller('reservation-status')
export class ReservationStatusController {
  constructor(
    private readonly reservationStatusService: ReservationStatusService,
  ) {}

  @Post()
  async create(@Body() createDto: CreateReservationStatusDto) {
    return this.reservationStatusService.createReservationStatus(createDto);
  }

  @Get()
  async findAll() {
    return this.reservationStatusService.getAllReservationStatuses();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const status = await this.reservationStatusService.getReservationStatusById(+id);
    if (!status) {
      throw new NotFoundException(`Reservation status with ID ${id} not found`);
    }
    return status;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateReservationStatusDto,
  ) {
    return this.reservationStatusService.updateReservationStatus(+id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.reservationStatusService.deleteReservationStatus(+id);
  }
}
