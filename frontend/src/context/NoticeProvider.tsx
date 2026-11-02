import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NoticeCtx, type Aviso, type TipoAviso } from './notice.context';

const DURACION_MS = 4000;

export function NoticeProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cerrar = useCallback(() => {
    clearTimeout(timer.current);
    setAviso(null);
  }, []);

  const notificar = useCallback((mensaje: string, tipo: TipoAviso = 'exito') => {
    clearTimeout(timer.current); // si había uno visible, se reemplaza y se reinicia el tiempo
    setAviso({ mensaje, tipo });
    timer.current = setTimeout(() => setAviso(null), DURACION_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const value = useMemo(() => ({ aviso, notificar, cerrar }), [aviso, notificar, cerrar]);

  return <NoticeCtx.Provider value={value}>{children}</NoticeCtx.Provider>;
}