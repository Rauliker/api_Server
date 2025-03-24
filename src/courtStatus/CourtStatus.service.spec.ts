import { expect } from '@jest/globals';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CourtStatusController } from './courtStatus.controller';
import { CreateCourtStatusDto, UpdateCourtStatusDto } from './courtStatus.dto';
import { CourtStatusService } from './courtStatus.service';

describe('CourtStatusController', () => {
  let controller: CourtStatusController;
  let service: CourtStatusService;

  const mockCourtStatusService = {
    create: jest.fn((dto: CreateCourtStatusDto) => {
      return { id: Date.now(), ...dto };
    }),
    findAll: jest.fn(() => {
      return [{ id: 1, name: 'Test Court Status' }];
    }),
    findOne: jest.fn((id: number) => {
      if (id === 1) {
        return { id, name: 'Test Court Status' };
      }
      throw new NotFoundException('Court status not found');
    }),
    update: jest.fn((id: number, dto: UpdateCourtStatusDto) => {
      if (id === 1) {
        return { id, ...dto };
      }
      throw new NotFoundException('Court status not found');
    }),
    remove: jest.fn((id: number) => {
      if (id === 1) {
        return { id, name: 'Test Court Status' };
      }
      throw new NotFoundException('Court status not found');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourtStatusController],
      providers: [
        {
          provide: CourtStatusService,
          useValue: mockCourtStatusService,
        },
      ],
    }).compile();

    controller = module.get<CourtStatusController>(CourtStatusController);
    service = module.get<CourtStatusService>(CourtStatusService);
  });

  it('should create a court status', async () => {
    const dto: CreateCourtStatusDto = { name: 'New Court Status' };
    expect(await controller.create(dto)).toEqual({
      id: expect.any(Number),
      ...dto,
    });
  });

  it('should retrieve all court status', async () => {
    expect(await controller.findAll()).toEqual([{ id: 1, name: 'Test Court Status' }]);
  });

  it('should retrieve a court status by ID', async () => {
    expect(await controller.findOne(1)).toEqual({ id: 1, name: 'Test Court Status' });
  });

  it('should throw an error for a non-existing court status', async () => {
    await expect(controller.findOne(2)).rejects.toThrow('Court status not found');
  });

  it('should update a court status', async () => {
    const dto: UpdateCourtStatusDto = { name: 'Updated Court Status' };
    expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
  });

  it('should throw an error when updating a non-existing court status', async () => {
    const dto: UpdateCourtStatusDto = { name: 'Updated Court Status' };
    await expect(controller.update(2, dto)).rejects.toThrow('Court status not found');
  });

  it('should delete a court status', async () => {
    expect(await controller.remove(1)).toEqual({ id: 1, name: 'Test Court Status' });
  });

  it('should throw an error when deleting a non-existing court status', async () => {
    await expect(controller.remove(2)).rejects.toThrow('Court status not found');
  });
});
