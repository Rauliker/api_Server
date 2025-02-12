import { BadRequestException, Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreateUserDto, LoginDto, UpdateUserDto } from './user.dto';
import { UserService } from './users.service';

@ApiTags('Users')  // Agrupa las rutas en Swagger bajo 'Users'
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

    logger = new Logger(UserService.name);
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
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        callback(null, true);
        }
      },
    }),
  )
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.', type: CreateUserDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFiles() files: Express.Multer.File[],
    
    @Query('email') emailInfo: string | null = null,
  ) {
    if (!files || files.length === 0) {
      return await this.userService.createUser(createUserDto, null, emailInfo);
    }
  
    const tempFilePaths = [];
    if (files && files.length > 0) {
      for (const file of files) {
      tempFilePaths.push(file.path);
      }
    }
  
    try {
      const imagenesUrls = [];
      for (const file of files) {
        imagenesUrls.push(`/images/avatar/${file.filename}`);
      }
      const user = await this.userService.createUser(createUserDto, imagenesUrls, emailInfo);
  
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
  
  
  @Put(':email')
  @UseInterceptors(
    FilesInterceptor('files', 1, {
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, callback) => {
          let email = req.params.email;
          if (email) {
            const filename = `${email}-avatar${path.extname(file.originalname)}`;
            callback(null, filename); 
          }
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        callback(null, true);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UpdateUserDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async updateUser(
    @Param('email') email: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if(email!=updateUserDto.email){
      
      throw new BadRequestException('Emails no coinciden');
    }
    const existingUser = await this.userService.findOne(updateUserDto.email);
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
  
    // Verificar si files es undefined o está vacío
    const tempFilePaths = [];
    if (files && files.length > 0) {
      for (const file of files) {
      tempFilePaths.push(file.path);
      }
    }
  
    try {
      if (files && files.length > 0) {
        const imagenesUrls = [];
        for (const file of files) {
          imagenesUrls.push(`/images/avatar/${file.filename}`);
        }
  
        const oldImagePath = `./images/avatar/${updateUserDto.email}-avatar${path.extname(existingUser.avatar || '')}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
  
        // Mover los archivos temporales a su ubicación final
        tempFilePaths.forEach((tempPath) => {
          const finalPath = path.join('./images/avatar', path.basename(tempPath));
          fs.renameSync(tempPath, finalPath);
        });
  
        updateUserDto.avatar = imagenesUrls[0]; // Asignar la nueva URL de la imagen
      }
  
      return await this.userService.updateUser(updateUserDto.email, updateUserDto);
    } catch (error) {
      // Eliminar los archivos temporales en caso de error
      tempFilePaths.forEach((tempPath) => {
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      });
      throw error;
    }
  }
  

  @Put('ban/:updateEmail/:email')
  @ApiOperation({ summary: 'Ban a user' })
  @ApiResponse({ status: 200, description: 'User banned successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async banUser(
    @Param('email') email: string,
    @Param('updateEmail') updateEmail: string,
  ) {
    return await this.userService.banUser(updateEmail,email);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [CreateUserDto] })
  findAllUsers() {
    return this.userService.findAll();
  }

  @Get('excpt/:email')
  @ApiOperation({ summary: 'Find all users except one by email' })
  @ApiResponse({ status: 200, description: 'List of users excluding the specified email', type: [CreateUserDto] })
  findAllExcpt(@Param('email') email: string) {
    return this.userService.findAllExcpt(email);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiResponse({ status: 200, description: 'User found', type: CreateUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOneUser(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

  @Get('logout/:email')
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out' })
  logout(@Param('email') email: string, @Query('device') device?: string) {
    return this.userService.logout(email, device);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(
      loginDto.email,
      loginDto.password,
      loginDto.deviceInfo,
      loginDto.fcmToken,
    );
}

  @Delete(':email/:emailDeleter')
  @ApiOperation({ summary: 'Delete a user by email' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  delete(@Param('email') email: string, @Param('emailDeleter') emailDeleterd: string) {
    return this.userService.deleteUser(email,emailDeleterd);
  }
}
