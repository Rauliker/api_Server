import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { User } from './users.entity';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),JwtModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([User])]
})
export class UserModule {}
