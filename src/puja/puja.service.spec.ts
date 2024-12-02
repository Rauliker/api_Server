// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Puja } from './puja.entity';
// import { PujaService } from './puja.service';

// describe('PujaService', () => {
//   let service: PujaService;
//   let repository: Repository<Puja>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         PujaService,
//         {
//           provide: getRepositoryToken(Puja),
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     service = module.get<PujaService>(PujaService);
//     repository = module.get<Repository<Puja>>(getRepositoryToken(Puja));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should create a puja', async () => {
//     const puja: Partial<Puja> = {
//       id: 1,
//       name: 'Puja 1',
//       description: 'Primera puja',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     jest.spyOn(repository, 'save').mockResolvedValue(puja as Puja);

//     expect(await service.createPuja(puja as Puja)).toEqual(puja);
//   });

//   it('should find all pujas', async () => {
//     const pujas: Partial<Puja>[] = [
//       { id: 1, name: 'Puja 1', description: 'Primera puja', createdAt: new Date(), updatedAt: new Date() },
//       { id: 2, name: 'Puja 2', description: 'Segunda puja', createdAt: new Date(), updatedAt: new Date() },
//     ];

//     jest.spyOn(repository, 'find').mockResolvedValue(pujas as Puja[]);

//     expect(await service.findAll()).toEqual(pujas);
//   });

//   it('should find a puja by id', async () => {
//     const puja = { id: 1, name: 'Puja 1', description: 'Primera puja', createdAt: new Date(), updatedAt: new Date() };

//     jest.spyOn(repository, 'findOne').mockResolvedValue(puja as Puja);

//     expect(await service.findOne(1)).toEqual(puja);
//   });
// });
