import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImageService {
  private readonly uploadPath = './uploads';

  constructor() {
    if (!existsSync(this.uploadPath)) {
      console.log('Creating uploads directory');
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadImage(file: any, id: string): Promise<string> {
    if (!file) {
      console.error('No file provided');
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    const fileName = `${id}-${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, fileName);
    console.log(`Saving file: ${filePath}`);
    writeFileSync(filePath, file.buffer);
    return fileName;
  }

  getImage(fileName: string): Buffer {
    const filePath = join(this.uploadPath, fileName);
    console.log(`Looking for file: ${filePath}`);
    if (!existsSync(filePath)) {
      console.error('File not found');
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return readFileSync(filePath);
  }

  getAllImages(): string[] {
    try {
      console.log('Reading files from uploads directory');
      const files = readdirSync(this.uploadPath);
      console.log(`Files found: ${files}`);
      return files;
    } catch (error) {
      console.error('Error reading files:', error.message);
      throw new HttpException('Error reading files', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteImage(fileName: string): Promise<void> {
    const filePath = join(this.uploadPath, fileName);
    console.log(`Deleting file: ${filePath}`);
    if (!existsSync(filePath)) {
      console.error('File to delete not found');
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    try {
      unlinkSync(filePath);
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error.message);
      throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
