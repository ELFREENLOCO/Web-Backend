import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { Response } from 'express';

@Controller('imagenStudent')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    try {
      console.log(`Uploading image for student ID: ${id}`);
      const fileName = await this.imageService.uploadImage(file, id);
      console.log(`Image uploaded successfully: ${fileName}`);
      return { message: 'File uploaded successfully', fileName };
    } catch (error) {
      console.error(`Error uploading image: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      console.log(`Fetching image: ${fileName}`);
      const imageBuffer = this.imageService.getImage(fileName);
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(imageBuffer);
    } catch (error) {
      console.error(`Error fetching image: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async getAllImages() {
    try {
      console.log('Fetching all images');
      const files = await this.imageService.getAllImages();
      console.log(`Found files: ${files}`);
      return { files };
    } catch (error) {
      console.error(`Error fetching all images: ${error.message}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':fileName')
  async deleteImage(@Param('fileName') fileName: string) {
    try {
      console.log(`Deleting image: ${fileName}`);
      await this.imageService.deleteImage(fileName);
      console.log(`Image deleted successfully: ${fileName}`);
      return { message: 'File deleted successfully' };
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        console.error(`File not found: ${fileName}`);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }
      console.error(`Error deleting file: ${error.message}`);
      throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
