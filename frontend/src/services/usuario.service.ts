import { apiFetch } from './api';

export interface UsuarioPerfil {
  id: number;
  nombre: string;
  tipo: string | null;
  activo: boolean;
  imagenUrl?: string | null;
}

export interface UpdateUsuarioDTO {
  nombre?: string;
  contrasena?: string;
  imagenUrl?: string | null;
}

export const usuarioService = {
  obtener(id: number): Promise<UsuarioPerfil> {
    return apiFetch<UsuarioPerfil>(`/usuarios/${id}`);
  },

  actualizar(id: number, datos: UpdateUsuarioDTO): Promise<UsuarioPerfil> {
    return apiFetch<UsuarioPerfil>(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(datos),
    });
  },

  eliminar(id: number): Promise<void> {
    return apiFetch<void>(`/usuarios/${id}`, { method: 'DELETE' });
  },
};
