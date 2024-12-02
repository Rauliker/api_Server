import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProvinciaService } from './provincia.service';
import { Provincia } from './provinvia.entity';

describe('ProvinciaService', () => {
  let service: ProvinciaService;
  let repository: Repository<Provincia>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProvinciaService,
        {
          provide: getRepositoryToken(Provincia),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProvinciaService>(ProvinciaService);
    repository = module.get<Repository<Provincia>>(getRepositoryToken(Provincia));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a provincia', async () => {
    const provincia = { name: 'Madrid' };
    jest.spyOn(repository, 'save').mockResolvedValue(provincia as Provincia);

    expect(await service.createProvincia(provincia)).toEqual(provincia);
  });

  it('should find all provincias', async () => {
    const provincias = [{ name: 'Madrid' }, { name: 'Barcelona' }];
    jest.spyOn(repository, 'find').mockResolvedValue(provincias as Provincia[]);

    expect(await service.findAll()).toEqual(provincias);
  });

  it('should find a provincia by id', async () => {
    const provincia = { id: 1, name: 'Madrid' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(provincia as Provincia);

    expect(await service.findOne(1)).toEqual(provincia);
  });
});
