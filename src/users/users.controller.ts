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
      const imagenesUrls = files.map(
        (file) => `/images/avatar/${file.filename}`,
      );
      const user = await this.userService.createUser(createUserDto, imagenesUrls);

      tempFilePaths.forEach((tempPath) => {
 
        const finalPath = path.join('./images/avatar', path.basename(tempPath));
        fs.renameSync(tempPath, finalPath);
      });

      return user;
    } catch (error) {
      tempFilePaths.forEach((tempPath) => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath); 
        }
      });
      throw error;
    }
  }

  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          const email = req.params?.email;
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
  @Put(':email')
  async updateUser(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const existingUser = await this.userService.findOne(email);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }

    const tempFilePaths = files?.map((file) => file.path) || [];
    try {
      if (files && files.length > 0) {
        const imagenesUrls = files.map(
          (file) => `/images/avatar/${file.filename}`,
        );

        const oldImagePath = `./images/avatar/${email}-avatar${path.extname(existingUser.avatar || '')}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); 
        }

        tempFilePaths.forEach((tempPath) => {
          const finalPath = path.join('./images/avatar', path.basename(tempPath));
          fs.renameSync(tempPath, finalPath);
        });

        updateUserDto.avatar = imagenesUrls[0];
      }

      return await this.userService.updateUser(email, updateUserDto);
    } catch (error) {
      tempFilePaths.forEach((tempPath) => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      });
      throw error;
    }
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
