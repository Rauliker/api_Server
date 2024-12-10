import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './users.service';

@Controller('users')

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':email')
  updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(email, updateUserDto);
  }

  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }

  @Get(':email')
  findOneUser(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Post('login')
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.userService.login(email, password);
  }
}
