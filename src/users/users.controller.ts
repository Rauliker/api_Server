import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthorizationMiddleware } from '../authorization.middleware';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './users.service';

@Controller('users')
@UseGuards(AuthorizationMiddleware)  
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto:LoginUserDto) {
    let message;

    try {
      const loginSuccesful=this.userService.login(loginDto.email, loginDto.password);
      message={message:"Login Sucessful", token:(await loginSuccesful).accessToken}
    } catch (error) {
      message={message:error}
    }
    return message;

  }
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}
