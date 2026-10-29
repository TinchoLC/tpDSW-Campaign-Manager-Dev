import { apiFetch } from './api';

export interface Usuario {
  id: number;
  nombre: string;
  tipo: string;
  imagenUrl?: string | null;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface CredentialsDTO {
  nombre: string;
  contrasena: string;
}

export const authService = {
  login(credenciales: CredentialsDTO): Promise<LoginResponse> {
    return apiFetch<LoginResponse>('/usuarios/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    });
  },

  register(datos: CredentialsDTO): Promise<Usuario> {
    return apiFetch<Usuario>('/usuarios/register', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },
};