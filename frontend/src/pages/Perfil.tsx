import { useState, useEffect, type FormEvent } from 'react';
import { Cargando } from '../components/Cargando';
import { ErrorAlert } from '../components/ErrorAlert';
import { ErrorPagina } from '../components/ErrorPagina';
import { ImageUpload } from '../components/ImageUpload';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { usuarioService, type UpdateUsuarioDTO } from '../services/usuario.service';
import { mensajeError } from '../utils/form';

export function Perfil() {
  const { usuario, actualizarUsuario, logout } = useAuth();
  const usuarioId = usuario?.id ?? 0;

  const { data: perfil, error, loading: cargando, recargar } = useApi(`perfil-${usuarioId}`, () =>
    usuarioService.obtener(usuarioId)
  );

  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);

  // Sincronizar estado inicial de la imagen cuando cargue el perfil
  useEffect(() => {
    if (perfil) {
      setImagenUrl(perfil.imagenUrl ?? null);
    }
  }, [perfil]);

  if (cargando) return <Cargando pagina />;
  if (error || !perfil || !usuario) {
    return (
      <ErrorPagina
        mensaje={error?.message ?? 'No se pudo cargar el perfil'}
        volverA="/campanas"
        textoVolver="← Volver a las campañas"
      />
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setErrorForm(null);
    setMensaje(null);

    const fd = new FormData(form);
    const nombre = String(fd.get('nombre') || '').trim();
    const contrasena = String(fd.get('contrasena') || '');

    // Solo se envía lo que cambió
    const cambios: UpdateUsuarioDTO = {};
    if (nombre !== perfil.nombre) cambios.nombre = nombre;
    if (contrasena !== '') cambios.contrasena = contrasena;
    if (imagenUrl !== (perfil.imagenUrl ?? null)) cambios.imagenUrl = imagenUrl;

    if (Object.keys(cambios).length === 0) {
      setErrorForm('No hay cambios para guardar');
      return;
    }

    setGuardando(true);
    try {
      const actualizado = await usuarioService.actualizar(usuario.id, cambios);
      // El nombre y el avatar se muestran en la barra de navegación, así que se actualiza la sesión
      actualizarUsuario({
        ...usuario,
        nombre: actualizado.nombre,
        imagenUrl: actualizado.imagenUrl,
      });
      recargar();
      setMensaje('Perfil actualizado');
      const inputPass = form.elements.namedItem('contrasena') as HTMLInputElement | null;
      if (inputPass) inputPass.value = '';
    } catch (err) {
      setErrorForm(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  const eliminarCuenta = async () => {
    if (
      !window.confirm(
        'Se da de baja tu cuenta, tus campañas como master y tus personajes. Esta acción no se puede deshacer. ¿Continuar?'
      )
    )
      return;

    try {
      await usuarioService.eliminar(usuario.id);
      logout();
    } catch (err) {
      setErrorForm(mensajeError(err));
    }
  };

  return (
    <main className="container py-4" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">Mi perfil</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {errorForm && <ErrorAlert mensaje={errorForm} />}

      <form onSubmit={handleSubmit} className="card p-4 mb-4">
        <p className="text-body-secondary">Rol: {perfil.tipo ?? 'jugador'}</p>

        <ImageUpload
          tipo="usuarios"
          valorInicial={perfil.imagenUrl}
          onChange={setImagenUrl}
          etiqueta="Foto de perfil / Avatar"
          forma="circulo"
        />

        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            name="nombre"
            type="text"
            className="form-control"
            minLength={3}
            maxLength={50}
            defaultValue={perfil.nombre}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nueva contraseña</label>
          <input
            name="contrasena"
            type="password"
            className="form-control"
            minLength={6}
            placeholder="Dejala vacía para no cambiarla"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={guardando}>
          Guardar cambios
        </button>
      </form>

      <div className="card border-danger p-4">
        <h5 className="text-danger">Eliminar cuenta</h5>
        <p>Se da de baja tu cuenta, tus campañas como master y tus personajes.</p>
        <button onClick={eliminarCuenta} className="btn btn-outline-danger align-self-start">
          Eliminar mi cuenta
        </button>
      </div>
    </main>
  );
}
