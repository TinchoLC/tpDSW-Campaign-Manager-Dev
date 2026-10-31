import { apiFetch } from './api';

export type CategoriaImagen = 'campanas' | 'usuarios' | 'personajes' | 'mapas' | 'objetos';

interface UploadResponse {
  message: string;
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  async subir(tipo: CategoriaImagen, archivo: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', archivo);

    const respuesta = await apiFetch<UploadResponse>(`/upload/${tipo}`, {
      method: 'POST',
      body: formData,
    });

    return respuesta.url;
  },
};
