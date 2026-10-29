import { createContext, useContext, useState, type ReactNode } from 'react';
import { authService, type CredentialsDTO, type Usuario } from '../services/auth.service';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credenciales: CredentialsDTO) => Promise<void>;
  register: (datos: CredentialsDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Leemos si ya había un token y un usuario guardados en localStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Iniciar sesión
  const login = async (credenciales: CredentialsDTO) => {
    const respuesta = await authService.login(credenciales);
    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
    setToken(respuesta.token);
    setUsuario(respuesta.usuario);
  };

  // Cuando te registras te logeas después de registrarte automáticamente
  const register = async (datos: CredentialsDTO) => {
    await authService.register(datos);
    await login(datos);
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: Boolean(token && usuario),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para el contexto 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}