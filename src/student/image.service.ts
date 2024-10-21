import { Injectable, HttpException, HttpStatus } from '@nestjs/common';  // Importa decorador y excepciones de NestJS
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'fs';  // Funciones del sistema de archivos
import { join } from 'path';  // Módulo para manipulación de rutas

@Injectable()  // Declara que esta clase es un servicio inyectable en otros componentes
export class ImageService {
  private readonly uploadPath = './uploads';  // Directorio donde se guardarán las imágenes

  constructor() {
    // Si no existe la carpeta `uploads`, se crea de manera recursiva
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  // Método para subir una imagen
  async uploadImage(file: any, id: string): Promise<string> {
    if (!file) {
      // Si no se proporciona un archivo, lanza un error con el código de estado 400 (BAD REQUEST)
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    // Crea un nombre único para el archivo con el formato: id-timestamp-originalname
    const fileName = `${id}-${Date.now()}-${file.originalname}`;
    const filePath = join(this.uploadPath, fileName);  // Genera la ruta completa donde se guardará el archivo
    writeFileSync(filePath, file.buffer);  // Escribe el archivo en el sistema de archivos
    return fileName;  // Devuelve el nombre del archivo guardado
  }

  // Método para obtener una imagen por su nombre de archivo
  getImage(fileName: string): Buffer {
    const filePath = join(this.uploadPath, fileName);  // Ruta completa del archivo
    if (!existsSync(filePath)) {
      // Si el archivo no existe, lanza un error con el código de estado 404 (NOT FOUND)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return readFileSync(filePath);  // Lee el archivo y devuelve su contenido como un buffer
  }

  // Método para listar todos los archivos en el directorio `uploads`
  //getAllImages(): string[] {
    // Lee los nombres de todos los archivos en la carpeta `uploads` y los devuelve como un array
    //return readdirSync(this.uploadPath);
 // }
   // Método para listar todos los archivos en el directorio `uploads`
   getAllImages() {
    // Lee los nombres de todos los archivos en la carpeta `uploads` y los devuelve como un array
    const files = readdirSync(this.uploadPath);
    return { files };
  }

  // Método para eliminar una imagen por su nombre de archivo
  async deleteImage(fileName: string): Promise<void> {
    const filePath = join(this.uploadPath, fileName);  // Ruta completa del archivo
    if (!existsSync(filePath)) {
      // Si el archivo no existe, lanza un error con el código de estado 404 (NOT FOUND)
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    try {
      unlinkSync(filePath);  // Elimina el archivo
    } catch (error) {
      // Si ocurre un error al eliminar, lanza una excepción
      throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
