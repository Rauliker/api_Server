import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveFile } from 'src/utils/file.utils';
import { AuthorizationMiddleware } from '../authorization.middleware';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './user.dto';
import { User } from './users.entity';
import { UserService } from './users.service';

@Controller('user')
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
  async findAll(@Request() req): Promise<User[]> {
    const token = req.headers.authorization.split(' ')[1];
    return this.userService.findAll(token);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: CreateUserDto) {
    const imageName = `${file.originalname.split('.')[0]}_${new Date().toISOString().split('T')[0]}.${file.originalname.split('.').pop()}`;
    const imagePath = `images/${imageName}`;    
    await saveFile(file, imagePath);
    
    
    return this.userService.create({ ...createUserDto, image:imagePath });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(@Request() req, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file?: Express.Multer.File) {
    if(file){
      const imageName = `${file.originalname.split('.')[0]}_${new Date().toISOString().split('T')[0]}.${file.originalname.split('.').pop()}`;
      const imagePath = `images/${imageName}`;    
      await saveFile(file, imagePath);
      updateUserDto.image=imagePath;
    }
    // const token = req.headers.authorization.split(' ')[1];

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Request() req) {
    const token = req.headers.authorization.split(' ')[1];

    return this.userService.remove(token);
  }
}
