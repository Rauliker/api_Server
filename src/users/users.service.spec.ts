import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { UserService } from './users.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const user = {
      email: 'test@example.com',
      password: '123456',
      username: 'test',
      banned: false,
      balance: 0,
      provincia: null,
      localidad: null,
    };
  
    jest.spyOn(repository, 'save').mockResolvedValue(user as User);
  
    expect(await service.createUser(user as any)).toEqual(user); 
  });
  
  
  

  it('should find all users', async () => {
    const users = [{ email: 'test@example.com' }, { email: 'user2@example.com' }];
    jest.spyOn(repository, 'find').mockResolvedValue(users as User[]);

    expect(await service.findAll()).toEqual(users);
  });

  it('should find a user by email', async () => {
    const user = { email: 'test@example.com' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(user as User);

    expect(await service.findOne('test@example.com')).toEqual(user);
  });
});
