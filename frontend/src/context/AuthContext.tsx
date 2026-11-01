import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { setUnauthorizedHandler } from '../services/api';
import { authService, type CredentialsDTO, type Usuario } from '../services/auth.service';
import {
  guardarSesion,
  guardarUsuario,
  leerSesion,
  limpiarSesion,
  type SesionGuardada,
} from '../utils/sesion';
import { AuthContext } from './auth.context';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Si había una sesión guardada la retomamos; si estaba corrupta, leerSesion la descarta
  const [sesion, setSesion] = useState<SesionGuardada>(leerSesion);

  // Iniciar sesión
  const login = async (credenciales: CredentialsDTO) => {
    const respuesta = await authService.login(credenciales);
    guardarSesion(respuesta.token, respuesta.usuario);
    setSesion({ token: respuesta.token, usuario: respuesta.usuario });
  };

  // Cuando te registras te logeas después de registrarte automáticamente
  const register = async (datos: CredentialsDTO) => {
    await authService.register(datos);
    await login(datos);
  };

  // Cerrar sesión
  const logout = useCallback(() => {
    limpiarSesion();
    setSesion({ token: null, usuario: null });
  }, []);

  // Actualiza los datos de la sesión (por ejemplo el nombre tras editar el perfil)
  const actualizarUsuario = useCallback((nuevo: Usuario) => {
    guardarUsuario(nuevo);
    setSesion((actual) => ({ ...actual, usuario: nuevo }));
  }, []);

  // Si la API responde 401 con un token guardado (vencido o inválido), cerramos la sesión
  // y las rutas protegidas redirigen solas al login
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion.usuario,
        token: sesion.token,
        isAuthenticated: Boolean(sesion.token && sesion.usuario),
        login,
        register,
        logout,
        actualizarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
