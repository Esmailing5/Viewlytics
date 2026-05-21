'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Envolvedor de Proveedores Globales de la Aplicación
 * 
 * Alberga el proveedor de TanStack Query y otros proveedores globales del lado del cliente.
 * Mantener los proveedores en un componente cliente separado evita que la plantilla de diseño raíz (layout)
 * tenga que marcarse como un componente cliente, preservando los beneficios de SSR de Next.js.
 * 
 * @see app/layout.tsx — Usado en el diseño raíz
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  // Crear QueryClient dentro de useState asegura que los datos no se compartan entre
  // diferentes usuarios/solicitudes en el lado del servidor, evitando la fuga de estado.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto de tiempo de expiración (stale time) por defecto
            refetchOnWindowFocus: false, // Evita la recarga agresiva al enfocar la ventana
            retry: 1, // Solo reintenta las solicitudes fallidas una vez
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
