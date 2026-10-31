// Texto de un campo del formulario; undefined si quedó vacío
export function txt(formData: FormData, nombre: string): string | undefined {
  const valor = String(formData.get(nombre) ?? '').trim();
  return valor === '' ? undefined : valor;
}

// Número de un campo del formulario; undefined si quedó vacío
export function num(formData: FormData, nombre: string): number | undefined {
  const valor = String(formData.get(nombre) ?? '').trim();
  return valor === '' ? undefined : Number(valor);
}

export function mensajeError(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado';
}
