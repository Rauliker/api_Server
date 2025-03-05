import * as fs from 'fs';
import * as path from 'path';

export const saveFile = (file: Express.Multer.File, filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(__dirname, '../../images', filePath);
        const dir = path.dirname(fullPath);

        // Create the directory if it doesn't exist
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }

            // Save the file
            fs.writeFile(fullPath, file.buffer, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
};
