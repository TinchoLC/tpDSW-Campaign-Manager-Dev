export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Error de la API: además del mensaje guarda el status HTTP para poder reaccionar (403, 404...)
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// El AuthProvider registra acá qué hacer cuando el token deja de ser válido
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Las imágenes se guardan como ruta relativa (/uploads/...) y las sirve el backend
export function resolveAssetUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers = new Headers(options.headers);

  // Si mandamos un body y no es un archivo (FormData), ponemos JSON por defecto
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Si hay un token guardado, lo adjuntamos siempre
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });

  // Token vencido o inválido: cerramos la sesión local. El login también responde 401
  // (credenciales incorrectas), pero ahí no hay sesión que cerrar.
  if (response.status === 401 && token && !endpoint.startsWith('/usuarios/login')) {
    onUnauthorized?.();
  }

  // Si la respuesta es 204 No Content (ej. un DELETE), no hay JSON para leer
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensajeError = data?.error || 'Mensaje de error genérico';
    throw new ApiError(mensajeError, response.status);
  }

  return data as T;
}
