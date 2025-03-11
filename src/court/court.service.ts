import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourtStatus } from '../courtStatus/courtStatus.entity';
import { CourtType } from '../courtType/courtType.entity';
import { CreateCourtDto, UpdateCourtDto } from './court.dto';
import { Court } from './court.entity';
const fs = require('fs');
const path = require('path');

@Injectable()
export class CourtService {
  constructor(
    @InjectRepository(Court)
    private courtRepository: Repository<Court>,
    @InjectRepository(CourtType)
    private typeRepository: Repository<CourtType>,
    @InjectRepository(CourtStatus)
    private statusRepository: Repository<CourtStatus>,
  ) {}

  async create(createCourtDto: CreateCourtDto) {
    const type = await this.typeRepository.findOneBy({ id: createCourtDto.typeId });
    if (!type) {
      throw new NotFoundException('Court type not found');
    }

    const status = await this.statusRepository.findOneBy({ id: createCourtDto.statusId });
    if (!status) {
      throw new NotFoundException('Court status not found');
    }
    if (!createCourtDto.name) {
      throw new UnauthorizedException('Name is required');
    }

    if (createCourtDto.availability === null || createCourtDto.availability === undefined) {
      throw new UnauthorizedException('Availability is required');
    }
    if(createCourtDto.price === null || createCourtDto.price === undefined){
      throw new UnauthorizedException('Price is required');
    }
    if(createCourtDto.price <= 0){
      throw new UnauthorizedException('Price must be greater than 0');
    }

    const court = this.courtRepository.create({
      name: createCourtDto.name,
      type,
      status,
      price: createCourtDto.price,
      availability:createCourtDto.availability
    });
    console.log('Datos a insertar:', createCourtDto.availability);


    return this.courtRepository.save(court);
  }

  async findAll() {
    return this.courtRepository.find({
      relations: ['type', 'status'],
    });
  }

  async addImage(id: number, file: Express.Multer.File) {
    console.log('Archivo recibido:', file); 
    if (!file) {
        throw new BadRequestException('No file uploaded');
    }
    const court = await this.findOne(id);
    court.imageUrl ="images/"+ court.name + court.type.name;
    const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file.originalname.split('.').pop();

    if (!validImageExtensions.includes(fileExtension)) {
      throw new NotFoundException('Invalid file type');
    }
    const imagesDir = path.join(__dirname, '..', '..', 'images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const filePath = path.join(imagesDir, `${court.name}_${court.type.name}.${fileExtension}`);
    fs.writeFileSync(filePath, file.buffer);
    court.imageUrl += `.${fileExtension}`;
    return this.courtRepository.save(court);
  }

  async findOne(id: number) {
    const court = await this.courtRepository.findOne({
      where: { id },
      relations: ['type', 'status'],
    });
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }

  async update(id: number, updateCourtDto: UpdateCourtDto) {
    const court = await this.findOne(id);

    if (updateCourtDto.typeId) {
      const type = await this.typeRepository.findOneBy({ id: updateCourtDto.typeId });
      if (!type) {
        throw new NotFoundException('Court type not found');
      }
      court.type = type;
    }

    if (updateCourtDto.statusId) {
      const status = await this.statusRepository.findOneBy({ id: updateCourtDto.statusId });
      if (!status) {
        throw new NotFoundException('Court status not found');
      }
      court.status = status;
    }
    if(updateCourtDto.price <= 0){
      throw new UnauthorizedException('Price must be greater than 0');
    }
    if (updateCourtDto.price !== null) {
      court.price = updateCourtDto.price;
    }

    if (updateCourtDto.availability !== null) {
      court.availability = {
        monday: updateCourtDto.availability.monday || [],
        tuesday: updateCourtDto.availability.tuesday || [],
        wednesday: updateCourtDto.availability.wednesday || [],
        thursday: updateCourtDto.availability.thursday || [],
        friday: updateCourtDto.availability.friday || [],
        saturday: updateCourtDto.availability.saturday || [],
        sunday: updateCourtDto.availability.sunday || [],
      };
    }
    if (updateCourtDto.name) {
      court.name = updateCourtDto.name;
    }

    return this.courtRepository.save(court);
  }

  async remove(id: number) {
    const court = await this.findOne(id);
    await this.courtRepository.remove(court);
    return court;
  }
}
