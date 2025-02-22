import { Module } from '@nestjs/common';
import { CreateUserDto } from './user.dto';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { User } from './users.entity';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  exports: [TypeOrmModule.forFeature([User]), CreateUserDto],

  providers: [UserService],
})
export class UserModule {}
