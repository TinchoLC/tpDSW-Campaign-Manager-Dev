import { createContext } from 'react';

export type TipoAviso = 'exito' | 'error';

export interface Aviso {
  mensaje: string;
  tipo: TipoAviso;
}

export interface NoticeValue {
  aviso: Aviso | null;
  notificar: (mensaje: string, tipo?: TipoAviso) => void;
  cerrar: () => void;
}

export const NoticeCtx = createContext<NoticeValue | undefined>(undefined);