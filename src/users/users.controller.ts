import { Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthorizationMiddleware } from '../authorization.middleware';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import { User } from './users.entity';
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
      message={code:201, message:"Login Sucessful", token:(await loginSuccesful).accessToken}
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return message;

  }
  @Get()
  async findAll(@Request() req): Promise<User[]> {
    const token = req.headers.authorization.split(' ')[1];
    return this.userService.findAll(token);
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
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const token = req.headers.authorization.split(' ')[1];

    return this.userService.update(token, updateUserDto);
  }

  @Delete(':id')
  async remove(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];

    return this.userService.remove(token);
  }
}
