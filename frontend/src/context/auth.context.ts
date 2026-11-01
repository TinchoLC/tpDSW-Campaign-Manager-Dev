import { createContext } from 'react';
import type { CredentialsDTO, Usuario } from '../services/auth.service';

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credenciales: CredentialsDTO) => Promise<void>;
  register: (datos: CredentialsDTO) => Promise<void>;
  logout: () => void;
  actualizarUsuario: (usuario: Usuario) => void;
}

// El objeto del contexto vive acá (y el hook en hooks/useAuth.ts) para que AuthContext.tsx
// exporte solo el componente AuthProvider, como pide react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
