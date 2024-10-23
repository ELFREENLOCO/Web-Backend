import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ImageService {
  // Ruta donde se almacenarán las imágenes subidas
  private readonly uploadPath = './uploads';

  constructor() {
    // Verifica si el directorio de carga existe; si no, lo crea
    if (!existsSync(this.uploadPath)) {
      console.log('Creating uploads directory');
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  // Método para subir una imagen
  async uploadImage(file: any, id: string): Promise<string> {
    // Verifica si se ha proporcionado un archivo
    if (!file) {
      console.error('No file provided');
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    // Genera un nombre de archivo único
    const fileName = `${id}-${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, fileName);
    console.log(`Saving file: ${filePath}`);
    // Escribe el archivo en el sistema de archivos
    writeFileSync(filePath, file.buffer);
    return fileName; // Devuelve el nombre del archivo guardado
  }

  // Método para obtener una imagen por su nombre
  getImage(fileName: string): Buffer {
    const filePath = join(this.uploadPath, fileName);
    console.log(`Looking for file: ${filePath}`);
    // Verifica si el archivo existe
    if (!existsSync(filePath)) {
      console.error('File not found');
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    // Lee y devuelve el contenido del archivo
    return readFileSync(filePath);
  }

  // Método para obtener todos los nombres de archivos de imágenes
  getAllImages(): string[] {
    try {
      console.log('Reading files from uploads directory');
      const files = readdirSync(this.uploadPath);
      console.log(`Files found: ${files}`);
      return files; // Devuelve una lista de nombres de archivos
    } catch (error) {
      console.error('Error reading files:', error.message);
      throw new HttpException('Error reading files', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Método para eliminar una imagen por su nombre
  async deleteImage(fileName: string): Promise<void> {
    const filePath = join(this.uploadPath, fileName);
    console.log(`Deleting file: ${filePath}`);
    // Verifica si el archivo a eliminar existe
    if (!existsSync(filePath)) {
      console.error('File to delete not found');
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    try {
      // Elimina el archivo del sistema
      unlinkSync(filePath);
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error.message);
      throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
