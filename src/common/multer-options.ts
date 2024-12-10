// import { MulterOptions } from '@nestjs/common';
// import * as path from 'path';

// export const multerOptions: MulterOptions = {
//   dest: './uploads', // Define la carpeta de destino
//   limits: {
//     fileSize: 30 * 1024 * 1024, // Límite de tamaño de archivo (5MB)
//   },
//   fileFilter: (req, file, cb) => {
//     const fileExtension = path.extname(file.originalname);
//     if (fileExtension !== '.jpg' && fileExtension !== '.jpeg' && fileExtension !== '.png') {
//       return cb(new Error('Solo se permiten imágenes (JPG, JPEG, PNG)'), false);
//     }
//     cb(null, true);
//   },
// };
