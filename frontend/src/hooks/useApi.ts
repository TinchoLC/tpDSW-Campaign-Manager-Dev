import { useCallback, useEffect, useRef, useState } from 'react';

interface Resultado<T> {
  key: string;
  data?: T;
  error?: Error;
}

/**
 * Carga datos al montar y cada vez que cambia `key`.
 * - `loading` es true mientras no llegó la respuesta para la `key` actual.
 * - `recargar()` vuelve a pedir los datos sin mostrar el estado de carga y, si falla,
 *   conserva lo último que se tenía (sirve para refrescos periódicos).
 */
export function useApi<T>(key: string, fetcher: () => Promise<T>) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  // Siempre usamos la última versión de `fetcher` sin tener que ponerla como dependencia
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelado = false;

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelado) setResultado({ key, data });
      })
      .catch((err: unknown) => {
        if (cancelado) return;
        const error = err instanceof Error ? err : new Error('Error inesperado');
        setResultado((previo) =>
          previo?.key === key && previo.data !== undefined ? previo : { key, error }
        );
      });

    return () => {
      cancelado = true;
    };
  }, [key, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);

  const vigente = resultado?.key === key ? resultado : null;

  return {
    data: vigente?.data,
    error: vigente?.error,
    loading: vigente === null,
    recargar,
  };
}
