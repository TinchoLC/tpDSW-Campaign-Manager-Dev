const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  // Si la respuesta es 204 No Content (ej. un DELETE), no hay JSON para leer
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensajeError = data?.error || 'Mensaje de error genérico';
    throw new Error(mensajeError);
  }

  return data as T;
}