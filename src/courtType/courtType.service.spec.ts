import { expect } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CourtTypeController } from './courtType.controller';
import { CreateCourtTypeDto, UpdateCourtTypeDto } from './courtType.dto';
import { CourtTypeService } from './courtType.service';

describe('CourtTypeController', () => {
  let controller: CourtTypeController;
  let service: CourtTypeService;

  const mockCourtTypeService = {
    create: jest.fn((dto: CreateCourtTypeDto) => {
      return { id: Date.now(), ...dto };
    }),
    findAll: jest.fn(() => {
      return [{ id: 1, name: 'Test Court Type' }];
    }),
    findOne: jest.fn((id: number) => {
      if (id === 1) {
        return { id, name: 'Test Court Type' };
      }
      throw new NotFoundException('Court type not found');
    }),
    update: jest.fn((id: number, dto: UpdateCourtTypeDto) => {
      if (id === 1) {
        return { id, ...dto };
      }
      throw new NotFoundException('Court type not found');
    }),
    remove: jest.fn((id: number) => {
      if (id === 1) {
        return { id, name: 'Test Court Type' };
      }
      throw new NotFoundException('Court type not found');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtTypeController],
      providers: [
        {
          provide: CourtTypeService,
          useValue: mockCourtTypeService,
        },
      ],
    }).compile();

    controller = module.get<CourtTypeController>(CourtTypeController);
    service = module.get<CourtTypeService>(CourtTypeService);
  });

  it('should create a court type', async () => {
    const dto: CreateCourtTypeDto = { name: 'New Court Type' };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
  });

  it('should retrieve all court types', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, name: 'Test Court Type' }]);
  });

  it('should retrieve a court type by ID', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1, name: 'Test Court Type' });
  });

  it('should throw an error for a non-existing court type', async () => {
    await expect(controller.findOne(2)).rejects.toThrow('Court type not found');
  });

  it('should update a court type', async () => {
    const dto: UpdateCourtTypeDto = { name: 'Updated Court Type' };
    expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
  });

  it('should throw an error when updating a non-existing court type', async () => {
    const dto: UpdateCourtTypeDto = { name: 'Updated Court Type' };
    await expect(controller.update(2, dto)).rejects.toThrow('Court type not found');
  });

  it('should delete a court type', async () => {
    expect(await controller.remove(1)).toEqual({ id: 1, name: 'Test Court Type' });
  });

  it('should throw an error when deleting a non-existing court type', async () => {
    await expect(controller.remove(2)).rejects.toThrow('Court type not found');
  });
});
