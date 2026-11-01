import type { Usuario } from '../services/auth.service';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

export interface SesionGuardada {
  token: string | null;
  usuario: Usuario | null;
}

const SIN_SESION: SesionGuardada = { token: null, usuario: null };

// Lo mínimo que el resto de la app da por sentado de un usuario guardado
function esUsuario(valor: unknown): valor is Usuario {
  if (typeof valor !== 'object' || valor === null) return false;
  const candidato = valor as Partial<Usuario>;
  return typeof candidato.id === 'number' && typeof candidato.nombre === 'string';
}

export function limpiarSesion() {
  localStorage.removeItem(CLAVE_TOKEN);
  localStorage.removeItem(CLAVE_USUARIO);
}

export function guardarSesion(token: string, usuario: Usuario) {
  localStorage.setItem(CLAVE_TOKEN, token);
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function guardarUsuario(usuario: Usuario) {
  localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
}

// Lee la sesión guardada. Si el JSON del usuario está roto o falta alguna de las dos partes,
// la descarta y limpia lo que quedó, en vez de dejar que la app falle al arrancar.
export function leerSesion(): SesionGuardada {
  try {
    const token = localStorage.getItem(CLAVE_TOKEN);
    const crudo = localStorage.getItem(CLAVE_USUARIO);

    if (token && crudo) {
      const usuario: unknown = JSON.parse(crudo);
      if (esUsuario(usuario)) return { token, usuario };
    }

    if (token || crudo) limpiarSesion();
    return SIN_SESION;
  } catch {
    // JSON inválido, o localStorage no disponible
    try {
      limpiarSesion();
    } catch {
      /* sin acceso a localStorage: no hay nada más que hacer */
    }
    return SIN_SESION;
  }
}
