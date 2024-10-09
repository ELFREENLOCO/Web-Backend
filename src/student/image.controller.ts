import { Controller, Post, Get, Param, UploadedFile, UseInterceptors, Res, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';  // Importa el interceptor para manejar la subida de archivos
import { ImageService } from './image.service';  // Importa el servicio donde está la lógica para manejar las imágenes
import { Response } from 'express';  // Tipo Response de express para manejar respuestas HTTP

//localhost:3000/imagenStudent
@Controller('imagenStudent')  // El controlador responde a rutas que comienzan con '/imagenStudent'
export class ImageController {
  constructor(private readonly imageService: ImageService) {}  // Inyecta el servicio de imágenes a través del constructor

  // Ruta POST para subir una imagen asociada a un estudiante por su ID
  // Ejemplo: POST /imagenStudent/1
  @Post(':id')  // Parámetro dinámico en la URL (:id)
  @UseInterceptors(FileInterceptor('file'))  // Intercepta la subida de archivos (campo 'file')
  async uploadImage(@Param('id') id: string, @UploadedFile() file: any) {
    try {
      const fileName = await this.imageService.uploadImage(file, id);  // Llama al servicio para subir la imagen
      return { message: 'File uploaded successfully', fileName };  // Devuelve un mensaje con el nombre del archivo
    } catch (error) {
      // Si hay un error en la subida, lanza una excepción HTTP
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Ruta GET para obtener una imagen específica por su nombre de archivo
  // Ejemplo: GET /imagenStudent/filename.jpg
  @Get(':fileName')  // Parámetro dinámico para el nombre del archivo (:fileName)
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      const imageBuffer = this.imageService.getImage(fileName);  // Obtiene la imagen desde el servicio
      res.setHeader('Content-Type', 'image/jpeg');  // Establece el encabezado de respuesta como una imagen JPEG
      res.send(imageBuffer);  // Envía la imagen como respuesta
    } catch (error) {
      // Si no se encuentra la imagen o hay un error, lanza una excepción
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Nueva ruta GET para obtener la lista de todos los archivos subidos
  @Get()  // Esta ruta no tiene parámetros; simplemente devuelve todos los archivos
  async getAllImages() {
    try {
      const files = this.imageService.getAllImages();  // Llama al servicio para obtener la lista de archivos
      return { files };  // Devuelve un objeto JSON con la lista de nombres de archivos
    } catch (error) {
      // Maneja cualquier error que pueda ocurrir
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Ruta DELETE para eliminar una imagen por su nombre de archivo
  // Ejemplo: DELETE /imagenStudent/filename.jpg
  @Delete(':fileName')  // Parámetro dinámico para el nombre del archivo a eliminar
  async deleteImage(@Param('fileName') fileName: string) {
    try {
      await this.imageService.deleteImage(fileName);  // Llama al servicio para eliminar el archivo
      return { message: 'File deleted successfully' };  // Devuelve un mensaje de éxito
    } catch (error) {
      // Si hay un error al eliminar, lanza una excepción
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
