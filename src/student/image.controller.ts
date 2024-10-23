// Importaciones necesarias para el servicio
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // Importa decorators y clases de NestJS
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, unlinkSync } from 'fs'; // Módulo 'fs' para el manejo de archivos
import { join } from 'path'; // Módulo 'path' para manejar rutas de archivos

@Injectable() // Marca la clase como un servicio que puede ser inyectado
export class ImageService {
  // Ruta donde se almacenarán las imágenes subidas
  private readonly uploadPath = './uploads';

  constructor() {
    // Verifica si el directorio de carga existe; si no, lo crea
    if (!existsSync(this.uploadPath)) {
      console.log('Creating uploads directory'); // Mensaje en consola
      mkdirSync(this.uploadPath, { recursive: true }); // Crea el directorio recursivamente si no existe
    }
  }

  // Método para subir una imagen
  async uploadImage(file: any, id: string): Promise<string> {
    // Verifica si se ha proporcionado un archivo
    if (!file) {
      console.error('No file provided'); // Mensaje de error en consola
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST); // Lanza excepción si no hay archivo
    }
    // Genera un nombre de archivo único utilizando el id y la fecha actual
    const fileName = `${id}-${Date.now()}-${file.originalname}`; 
    const filePath = join(this.uploadPath, fileName); // Crea la ruta completa del archivo
    console.log(`Saving file: ${filePath}`); // Mensaje en consola
    // Escribe el archivo en el sistema de archivos
    writeFileSync(filePath, file.buffer); 
    return fileName; // Devuelve el nombre del archivo guardado
  }

  // Método para obtener una imagen por su nombre
  getImage(fileName: string): Buffer {
    const filePath = join(this.uploadPath, fileName); // Crea la ruta completa del archivo
    console.log(`Looking for file: ${filePath}`); // Mensaje en consola
    // Verifica si el archivo existe
    if (!existsSync(filePath)) {
      console.error('File not found'); // Mensaje de error en consola
      throw new HttpException('File not found', HttpStatus.NOT_FOUND); // Lanza excepción si el archivo no existe
    }
    // Lee y devuelve el contenido del archivo
    return readFileSync(filePath); 
  }

  // Método para obtener todos los nombres de archivos de imágenes
  getAllImages(): string[] {
    try {
      console.log('Reading files from uploads directory'); // Mensaje en consola
      const files = readdirSync(this.uploadPath); // Lee los archivos del directorio de carga
      console.log(`Files found: ${files}`); // Mensaje en consola con los nombres de los archivos encontrados
      return files; // Devuelve una lista de nombres de archivos
    } catch (error) {
      console.error('Error reading files:', error.message); // Mensaje de error en consola
      throw new HttpException('Error reading files', HttpStatus.INTERNAL_SERVER_ERROR); // Lanza excepción si hay un error al leer
    }
  }

  // Método para eliminar una imagen por su nombre
  async deleteImage(fileName: string): Promise<void> {
    const filePath = join(this.uploadPath, fileName); // Crea la ruta completa del archivo
    console.log(`Deleting file: ${filePath}`); // Mensaje en consola
    // Verifica si el archivo a eliminar existe
    if (!existsSync(filePath)) {
      console.error('File to delete not found'); // Mensaje de error en consola
      throw new HttpException('File not found', HttpStatus.NOT_FOUND); // Lanza excepción si el archivo no existe
    }
    try {
      // Elimina el archivo del sistema
      unlinkSync(filePath); 
      console.log('File deleted successfully'); // Mensaje en consola si se elimina exitosamente
    } catch (error) {
      console.error('Error deleting file:', error.message); // Mensaje de error en consola
      throw new HttpException('Error deleting file', HttpStatus.INTERNAL_SERVER_ERROR); // Lanza excepción si hay un error al eliminar
    }
  }
}
