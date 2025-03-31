'use client';

import { SessionProvider } from "next-auth/react";

/**
 * Provider para la autenticación con NextAuth
 * Envuelve la aplicación para proporcionar acceso a la sesión
 */
export function AuthProvider({ children, session }) {
  return (
    <SessionProvider 
      session={session} 
      refetchInterval={5 * 60} // Refrescar cada 5 minutos
      refetchOnWindowFocus={true} // Refrescar cuando la ventana recupera el foco
      refetchWhenOffline={false} // No refrescar cuando está offline
    >
      {children}
    </SessionProvider>
  );
}