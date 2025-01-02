import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          const email = req.body?.email;
          if (!email) {
            callback(new BadRequestException('Email is required'), null);
          } else {

            const filename = `${email}-avatar${path.extname(file.originalname)}`;
            callback(null, filename); 
          }
        },
      }),
    }),
  )
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    const tempFilePaths = files.map((file) => file.path);

    try {
      // Crear usuario en la base de datos
      const imagenesUrls = files.map(
        (file) => `/images/avatar/${file.filename}`, // URLs relativas
      );
      const user = await this.userService.createUser(createUserDto, imagenesUrls);

      // Mover imágenes del directorio temporal al final
      tempFilePaths.forEach((tempPath) => {
 
        const finalPath = path.join('./images/avatar', path.basename(tempPath));
        fs.renameSync(tempPath, finalPath); // Mover archivo
      });

      return user;
    } catch (error) {
      // Eliminar archivos temporales en caso de error
      tempFilePaths.forEach((tempPath) => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath); 
        }
      });
      throw error; // Propagar error
    }
  }

  @Put(':email')
  updateUser(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(email, updateUserDto);
  }

  @Get()
  findAllUsers() {
    return this.userService.findAll();
  }
  @Get('excpt/:email')
  findAllExcpt(@Param('email') email: string) {
    return this.userService.findAllExcpt(email);
  }

  @Get(':email')
  findOneUser(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Post('login')
  login(@Body() { email, password }: { email: string; password: string }) {
    return this.userService.login(email, password);
  }

  @Delete(':email')
  delete(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
